# Analysis log retention

## Purpose

`analysis_log` has no index and no retention, and every Analysis run loads the console logs, so each run scans the whole table. On a self-hosted Postgres with about 966k rows, concurrent scans filled the connection pool and blocked every service on that database (tago-io/issues#1170). The fix bounds both the cost of reading logs and the size of the table.

## Scope

- In: an index on `analysis_log` in the PostgreSQL, MySQL, and SQLite plugins; a run path that skips the logs; per-analysis log retention through a new SDK method, its three plugin implementations, and a server timer.
- Out: console UI changes; log export.
- Later: a concurrency cap on Action-triggered runs (`packages/server/Services/Action.ts:254`); documenting `TCORE_ANALYSIS_LOG_MAX_LINES` in tago-io/docs; a Settings page field for the limit; a one-time cleanup of SQLite logs orphaned before the 0.3.3 foreign key.

## Stack

- Throwaway `postgres:16` and `mysql:8` Docker containers for the query plan and retention checks; neither database runs in the test suite.

## Decisions

- All three database plugins get the fix: they share the `DatabaseModule` contract and the missing index.
- One composite index on `(analysis_id, timestamp)`: it serves the console query, the retention trim, `deleteAnalysisLogs`, and the cascade from `analysis`.
- Postgres builds the index with a plain `CREATE INDEX IF NOT EXISTS` inside the migration, not `CONCURRENTLY`: a failed concurrent build leaves an INVALID index that `IF NOT EXISTS` then skips on every start.
- Retention keeps the newest 1,000 lines per analysis: a row cap bounds the table whatever the log rate, and the console shows 100.
- The limit comes from `TCORE_ANALYSIS_LOG_MAX_LINES`, default 1000, read from `process.env` like the other `TCORE_*` variables, so an empty value means the default. Any other value that is not a positive integer stops the server at startup with the variable's name in the error.
- Database plugins get a 10-minute load limit instead of 30 s: the index build runs inside `onLoad`, and a slow migration is work, not a hang.
- `applyAnalysisLogRetention` removes at most a fixed number of chunks per call and returns how many rows it removed; the server calls it again for the same analysis until a call removes less than the cap. Each call stays under the 60 s plugin call timeout.
- MySQL trims by count with `DELETE ... ORDER BY timestamp ASC LIMIT n`: its `TIMESTAMP` column has second precision, so a cutoff would keep whole seconds of rows.
- Postgres batches with `ctid = ANY(ARRAY(...))`, which plans as a TID scan on every version.
- Retention keeps detecting a plugin without the method by its error message: a capability flag changes the protocol with every plugin for a hypothetical third-party one.
- Retention runs per analysis through `applyAnalysisLogRetention(analysisID, { max_lines })`, called by the server once per analysis, mirroring `applyDeviceDataRetention`: a table-wide trim by count needs a full scan.
- Deletes run in chunks: the first trim on the reported database removes about 960k rows, and one statement would hold a pooled connection for all of it.
- The root `package.json` version goes to 1.0.4 in the same PR, as the previous fixes did.

## Executor may decide

Decide alone: naming (migration files, index, types), chunk size, error wording, test placement, and whether the timer also runs once at startup. Stop and report: anything not listed above, any conflict with an existing repo pattern, any item that needs a library the repo does not already use, and any change to the shape of `applyAnalysisLogRetention` or to the `GET /analysis/:id` response.

## Items

### 1. Index `analysis_log` on `(analysis_id, timestamp)`

- One idempotent migration per plugin, guarded like the existing ones because `disableMigrationsListValidation` is on.
- Done when:
  - Postgres 16 container, plugin migrations applied, `EXPLAIN` of the console query (`WHERE analysis_id = ? ORDER BY timestamp DESC LIMIT 100`): Index Scan on the new index, no Seq Scan
  - MySQL 8 container, same query: `EXPLAIN` key is the new index, no "Using filesort"
  - SQLite in memory, in a Vitest test: `EXPLAIN QUERY PLAN` shows `SEARCH analysis_log USING INDEX`
  - Applying the migrations a second time: no error

### 2. Run analyses without loading their logs

- `runAnalysis` uses only `id`, `active`, `binary_path`, `file_path`, and `variables`; `GET /analysis/:id` keeps returning `console`.
- Done when:
  - `just test packages/server`: green, with a test showing `runAnalysis` never calls `getAnalysisLogs` and `getAnalysisInfo` still returns `console`

### 3. `applyAnalysisLogRetention` in the SDK and the three plugins

- Rows with a NULL timestamp count as the oldest and go first.
- Rows that share the cutoff timestamp are all kept, even past `max_lines`.
- After: 1
- Review: before dependents
- Done when:
  - SQLite in memory, in a Vitest test: analysis A with 1,200 rows and B with 50, `max_lines` 1000: A keeps its 1,000 newest rows and B keeps all 50
  - Postgres 16 and MySQL 8 containers, same seed: same result

### 4. Retention timer and `TCORE_ANALYSIS_LOG_MAX_LINES`

- Built like `packages/server/Services/DeviceDataRetention.ts`: 10-minute interval, a lock against overlapping cycles, started next to `startDataRetentionTimer()` in `packages/server/main.ts`.
- A plugin that throws "Method not implemented" is skipped without logging an error each cycle.
- Carries the bump to 1.0.4, in its own commit: the root `package.json` and `tcore_version` in `plugins/tagoio-integration/src/back/RealtimeConnection.ts`, as `1baaae4` did.
- After: 3
- Done when:
  - `just test packages/server`: green, with tests for one call per analysis with `max_lines` 1000 when the variable is unset, 250 when it is `250`, startup failing with the variable named when it is `abc` or `0`, and no `logError` call on "Method not implemented"
  - `just linter`: clean

### 5. Database plugins get a 10-minute load limit

- Other plugin types keep 30 s.
- The plugin shows a message while migrations run, so a slow start reads as work in progress.
- Done when:
  - `just test packages/server`: green, with tests showing a database plugin still loading at 31 s is not stopped, and another plugin type still is

### 6. Run path writes cannot crash the server

- A rejected `addAnalysisLog` or `editAnalysis` call from `runAnalysis` is logged, never left unhandled.
- `getAnalysisRunInfo`, `getAnalysisInfo`, and `validateAnalysisID` share one lookup that throws "Invalid Analysis ID".
- Done when:
  - `just test packages/server`: green, with tests showing a rejected log write or `last_run` update is logged and raises no unhandled rejection

### 7. Retention calls stay short and exact

- `applyAnalysisLogRetention` returns the number of rows it removed and removes at most a fixed number of chunks per call.
- Postgres selects each chunk with `ctid = ANY(ARRAY(...))`.
- MySQL deletes by count, oldest first, NULL timestamps first.
- The MySQL `down` guards its single-column index with the same `information_schema.STATISTICS` check `up` uses.
- Review: before dependents
- Done when:
  - SQLite in memory, in a Vitest test: an analysis with more rows than one call's cap loses exactly the cap on the first call, and repeated calls end at `max_lines`
  - Postgres 16 container, at least 200k rows: `EXPLAIN` of the chunk delete shows a TID scan and no Seq Scan
  - MySQL 8 container: 3,000 rows in the same second, `max_lines` 1000: exactly 1,000 remain
  - MySQL 8 container: up, down, up, down: no error

### 8. Retention timer finishes every analysis

- Calls `applyAnalysisLogRetention` again for the same analysis while a call removes the full cap.
- A failure on one analysis is logged and the cycle moves on; the not-implemented errors still end the cycle silently.
- A failed analysis list is logged before the cycle returns.
- An empty `TCORE_ANALYSIS_LOG_MAX_LINES` means 1000.
- After: 7
- Done when:
  - `just test packages/server`: green, with tests for repeated calls until one removes less than the cap, a rejecting analysis followed by one that is still trimmed, a logged list failure, and `""` reading as 1000
  - `just linter`: clean

---

## History

| Date | Item | Event | Description |
|---|---|---|---|
| 2026-11-04 | - | Created | tago-io/issues#1170 |
| 2026-11-04 | 4 | Updated | Item 4 carries the 1.0.4 version bump. |
| 2026-11-04 | 1 | Dispatched | TAG-1170-analysis-log-retention, start 48f7e19 |
| 2026-11-04 | 3 | Dispatched | TAG-1170-analysis-log-retention, start 48f7e19 |
| 2026-11-04 | 2 | Dispatched | TAG-1170-analysis-log-retention, start 48f7e19 |
| 2026-11-04 | 4 | Dispatched | TAG-1170-analysis-log-retention, start 48f7e19 |
| 2026-11-04 | 4 | Updated | The version bump also changes `tcore_version` in the TagoIO integration plugin. |
| 2026-11-04 | 1 | Executor decided | Index name `analysis_log_analysis_id_timestamp_index`. |
| 2026-11-04 | 1 | Executor decided | The MySQL guard filters `information_schema.STATISTICS` by `TABLE_SCHEMA = DATABASE()`. |
| 2026-11-04 | 1 | Executor decided | The MySQL `down` adds a single-column `analysis_id` index before dropping the composite one, to avoid ERROR 1553. |
| 2026-11-04 | 2 | Executor decided | `getAnalysisRunInfo` and `zAnalysisRunInfo` live in `packages/server/Services/Analysis.ts`, not the SDK. |
| 2026-11-04 | 2 | Executor decided | The run path validates only `id`, `active`, `binary_path`, `file_path`, and `variables`, so a row with an invalid name, tags, or `created_at` now runs. |
| 2026-11-04 | 3 | Executor decided | The query type is a plain `IDatabaseApplyAnalysisLogRetentionQuery`, not a zod schema. |
| 2026-11-04 | 3 | Executor decided | Chunks of 5,000 rows: Postgres by `ctid`, SQLite by `rowid`, MySQL by raw `DELETE ... LIMIT`. |
| 2026-11-04 | 3 | Executor decided | With fewer than `max_lines` timestamped rows, NULL-timestamp rows are cut down to exactly `max_lines`; which survive is arbitrary. |
| 2026-11-04 | 3 | Executor decided | The cutoff passes as a JS Date; sub-millisecond Postgres values keep a few extra rows. |
| 2026-11-04 | 3 | Executor decided | Plugins do not validate `max_lines`; the server does. |
| 2026-11-04 | 4 | Executor decided | `TCORE_ANALYSIS_LOG_MAX_LINES` is checked first in `startServer` and passed into the timer. |
| 2026-11-04 | 4 | Executor decided | An empty `TCORE_ANALYSIS_LOG_MAX_LINES` stops startup instead of meaning the default. |
| 2026-11-04 | 4 | Executor decided | "Function applyAnalysisLogRetention is not implemented" is skipped silently, as "Method not implemented" is. |
| 2026-11-04 | 4 | Executor decided | No trim at startup; the first one runs 10 minutes after boot. |
| 2026-11-04 | 4 | Executor decided | Errors go to `logError("api", ...)`. |
| 2026-11-04 | 4 | Executor decided | The timer returns silently when the analysis list fails and is not stopped in `shutdown.ts`, as the device timer. |
| 2026-11-04 | 1 | Completed | PR tago-io/tagocore#105, branch renamed to fix/1170-analysis-log-retention |
| 2026-11-04 | 2 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | 3 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | 4 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | - | Updated | Items 5 to 8 added from the review on PR #105; an empty `TCORE_ANALYSIS_LOG_MAX_LINES` now means the default. |
| 2026-11-04 | 7 | Dispatched | fix/1170-analysis-log-retention, start 5cb62ca |
| 2026-11-04 | 5 | Dispatched | fix/1170-analysis-log-retention, start 5cb62ca |
| 2026-11-04 | 6 | Dispatched | fix/1170-analysis-log-retention, start 5cb62ca |
| 2026-11-04 | 8 | Dispatched | fix/1170-analysis-log-retention, start 5cb62ca |
| 2026-11-04 | 5 | Executor decided | A database plugin's module `start` call also waits up to 10 minutes, not the 60 s call timeout. |
| 2026-11-04 | 5 | Executor decided | A database plugin is one whose `tcore.types` includes "database". |
| 2026-11-04 | 5 | Executor decided | The migration message is "Updating the database. This can take several minutes.", shown in the console and printed to the terminal. |
| 2026-11-04 | 6 | Executor decided | The shared lookup is a private `findAnalysis` in `packages/server/Services/Analysis.ts`. |
| 2026-11-04 | 7 | Executor decided | The per-call cap is the SDK export `ANALYSIS_LOG_RETENTION_CALL_LIMIT = 20000`. |
| 2026-11-04 | 7 | Executor decided | Postgres deletes NULL-timestamp rows in their own pass before the older-than-cutoff pass; both share the per-call cap. |
| 2026-11-04 | 7 | Executor decided | SQLite orders each chunk by `timestamp` ascending, so NULL rows go first in code. |
| 2026-11-04 | 8 | Executor decided | A non-number result from a plugin counts as less than the cap, so that analysis is called once per cycle. |
| 2026-11-04 | 8 | Executor decided | Repeat calls for one analysis have no upper limit. |
| 2026-11-04 | 5 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | 6 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | 7 | Completed | PR tago-io/tagocore#105 |
| 2026-11-04 | 8 | Completed | PR tago-io/tagocore#105 |
