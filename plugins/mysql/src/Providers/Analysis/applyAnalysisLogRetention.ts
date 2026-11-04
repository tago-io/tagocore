import {
  ANALYSIS_LOG_RETENTION_CALL_LIMIT,
  type IDatabaseApplyAnalysisLogRetentionQuery,
  type TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Most rows a single delete removes, so a large trim never holds a pooled connection for long.
 */
const DELETE_CHUNK_SIZE = 5000;

/**
 * Deletes, in chunks, up to `limit` of the oldest logs of an analysis, and returns how many it deleted.
 */
async function deleteOldestLogsInChunks(
  analysisID: TGenericID,
  limit: number,
): Promise<number> {
  let deleted = 0;

  while (deleted < limit) {
    const size = Math.min(DELETE_CHUNK_SIZE, limit - deleted);
    // Knex cannot compile a LIMIT on a MySQL delete. Ascending order puts NULL timestamps first.
    const [result] = await mainDB.write.raw(
      "DELETE FROM analysis_log WHERE analysis_id = ? ORDER BY `timestamp` ASC LIMIT ?",
      [analysisID, size],
    );

    const chunkDeleted: number = result.affectedRows;
    deleted += chunkDeleted;
    if (chunkDeleted < size) {
      break;
    }
  }

  return deleted;
}

/**
 * Applies log retention for an analysis by deleting all but its newest `max_lines` logs, at most
 * `ANALYSIS_LOG_RETENTION_CALL_LIMIT` per call, and returns how many it deleted.
 * Logs without a timestamp count as the oldest.
 *
 * Trims by count rather than by a cutoff timestamp: the `TIMESTAMP` column has second precision, so a cutoff
 * would keep every log of its second, however many there are.
 */
async function applyAnalysisLogRetention(
  analysisID: TGenericID,
  query: IDatabaseApplyAnalysisLogRetentionQuery,
): Promise<number> {
  const total = await mainDB.write
    .count({ amount: "*" })
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .first();

  const excess = Number(total?.amount ?? 0) - query.max_lines;
  if (excess <= 0) {
    return 0;
  }

  return await deleteOldestLogsInChunks(
    analysisID,
    Math.min(excess, ANALYSIS_LOG_RETENTION_CALL_LIMIT),
  );
}

export default applyAnalysisLogRetention;
