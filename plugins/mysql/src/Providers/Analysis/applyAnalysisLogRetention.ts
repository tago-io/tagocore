import type {
  IDatabaseApplyAnalysisLogRetentionQuery,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import type { Knex } from "knex";
import { mainDB } from "../../Database/index.ts";

/**
 * Most rows a single delete removes, so a large trim never holds a pooled connection for long.
 */
const DELETE_CHUNK_SIZE = 5000;

/**
 * SQL condition on `analysis_log` rows, with its bindings.
 */
type LogFilter = { sql: string; bindings: readonly Knex.Value[] };

/**
 * Deletes, in chunks, up to `limit` logs of an analysis that match `filter`.
 */
async function deleteLogsInChunks(
  analysisID: TGenericID,
  filter: LogFilter,
  limit: number,
): Promise<void> {
  let remaining = limit;

  while (remaining > 0) {
    const size = Math.min(DELETE_CHUNK_SIZE, remaining);
    // Knex cannot compile a LIMIT on a MySQL delete.
    const [result] = await mainDB.write.raw(
      `DELETE FROM analysis_log WHERE analysis_id = ? AND (${filter.sql}) LIMIT ?`,
      [analysisID, ...filter.bindings, size],
    );

    const deleted: number = result.affectedRows;
    remaining -= deleted;
    if (deleted < size) {
      return;
    }
  }
}

/**
 * Applies log retention for an analysis by deleting all but its newest `max_lines` logs.
 * Logs without a timestamp count as the oldest, and logs that share the cutoff timestamp are all kept.
 */
async function applyAnalysisLogRetention(
  analysisID: TGenericID,
  query: IDatabaseApplyAnalysisLogRetentionQuery,
): Promise<void> {
  const cutoff = await mainDB.write
    .first("timestamp")
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .whereNotNull("timestamp")
    .orderBy("timestamp", "desc")
    .offset(query.max_lines - 1);

  if (cutoff) {
    const olderThanCutoff: LogFilter = {
      sql: "`timestamp` < ? OR `timestamp` IS NULL",
      bindings: [cutoff.timestamp],
    };
    await deleteLogsInChunks(
      analysisID,
      olderThanCutoff,
      Number.POSITIVE_INFINITY,
    );
    return;
  }

  // Fewer than `max_lines` logs carry a timestamp: they all stay, and logs without one fill the remaining room.
  const total = await mainDB.write
    .count({ amount: "*" })
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .first();

  const excess = Number(total?.amount ?? 0) - query.max_lines;
  if (excess > 0) {
    const withoutTimestamp: LogFilter = {
      sql: "`timestamp` IS NULL",
      bindings: [],
    };
    await deleteLogsInChunks(analysisID, withoutTimestamp, excess);
  }
}

export default applyAnalysisLogRetention;
