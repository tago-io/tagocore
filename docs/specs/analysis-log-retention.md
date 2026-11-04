# Analysis log retention

## Purpose

`analysis_log` has no index and no retention, and every Analysis run loads the console logs, so each run scans the whole table. On a self-hosted Postgres with about 966k rows, concurrent scans filled the connection pool and blocked every service on that database (tago-io/issues#1170). The fix bounds both the cost of reading logs and the size of the table.

## Scope

- In: an index on `analysis_log` in the PostgreSQL, MySQL, and SQLite plugins; a run path that skips the logs; per-analysis log retention through a new SDK method, its three plugin implementations, and a server timer.
- Out: console UI changes; log export.
- Later: a concurrency cap on Action-triggered runs (`packages/server/Services/Action.ts:254`); documenting `TCORE_ANALYSIS_LOG_MAX_LINES` in tago-io/docs; a Settings page field for the limit.

## Stack

- Throwaway `postgres:16` and `mysql:8` Docker containers for the query plan and retention checks; neither database runs in the test suite.

## Decisions

- All three database plugins get the fix: they share the `DatabaseModule` contract and the missing index.
- One composite index on `(analysis_id, timestamp)`: it serves the console query, the retention trim, `deleteAnalysisLogs`, and the cascade from `analysis`.
- Postgres builds the index with a plain `CREATE INDEX IF NOT EXISTS` inside the migration, not `CONCURRENTLY`: a failed concurrent build leaves an INVALID index that `IF NOT EXISTS` then skips on every start.
- Retention keeps the newest 1,000 lines per analysis: a row cap bounds the table whatever the log rate, and the console shows 100.
- The limit comes from `TCORE_ANALYSIS_LOG_MAX_LINES`, default 1000, read from `process.env` like the other `TCORE_*` variables. Anything other than a positive integer stops the server at startup with the variable's name in the error.
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
