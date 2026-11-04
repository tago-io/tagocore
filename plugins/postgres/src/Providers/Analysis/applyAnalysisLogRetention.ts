import {
  ANALYSIS_LOG_RETENTION_CALL_LIMIT,
  type IDatabaseApplyAnalysisLogRetentionQuery,
  type TGenericID,
} from "@tago-io/tcore-sdk/types";
import type { Knex } from "knex";
import { mainDB } from "../../Database/index.ts";

/**
 * Most rows a single delete removes, so a large trim never holds a pooled connection for long.
 */
const DELETE_CHUNK_SIZE = 5000;

/**
 * Deletes, in chunks, up to `limit` logs of an analysis that match `filter`, and returns how many it deleted.
 */
async function deleteLogsInChunks(
  analysisID: TGenericID,
  filter: (builder: Knex.QueryBuilder) => void,
  limit: number,
): Promise<number> {
  let deleted = 0;

  while (deleted < limit) {
    const size = Math.min(DELETE_CHUNK_SIZE, limit - deleted);
    // Without the index order, the LIMIT makes a Seq Scan look cheap to the planner even when the analysis's
    // rows sit at the end of the table.
    const chunk = mainDB.write
      .select("ctid")
      .from("analysis_log")
      .where("analysis_id", analysisID)
      .where(filter)
      .orderBy("timestamp", "asc")
      .limit(size);

    // `ctid IN (subquery)` can plan as a join that scans the whole table; an array of ctids is a TID scan.
    const chunkDeleted = await mainDB.write
      .delete()
      .from("analysis_log")
      .whereRaw("ctid = ANY(ARRAY(?))", [chunk]);

    deleted += chunkDeleted;
    if (chunkDeleted < size) {
      break;
    }
  }

  return deleted;
}

/**
 * Matches the logs without a timestamp.
 */
const withoutTimestamp = (builder: Knex.QueryBuilder) => {
  builder.whereNull("timestamp");
};

/**
 * Applies log retention for an analysis by deleting all but its newest `max_lines` logs, at most
 * `ANALYSIS_LOG_RETENTION_CALL_LIMIT` per call, and returns how many it deleted.
 * Logs without a timestamp count as the oldest, and logs that share the cutoff timestamp are all kept.
 */
async function applyAnalysisLogRetention(
  analysisID: TGenericID,
  query: IDatabaseApplyAnalysisLogRetentionQuery,
): Promise<number> {
  const cutoff = await mainDB.write
    .first("timestamp")
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .whereNotNull("timestamp")
    .orderBy("timestamp", "desc")
    .offset(query.max_lines - 1);

  if (cutoff) {
    // The index sorts NULL timestamps last, so the logs without one, the oldest, go in their own pass first.
    const deletedWithoutTimestamp = await deleteLogsInChunks(
      analysisID,
      withoutTimestamp,
      ANALYSIS_LOG_RETENTION_CALL_LIMIT,
    );
    const olderThanCutoff = (builder: Knex.QueryBuilder) => {
      builder.where("timestamp", "<", cutoff.timestamp);
    };
    const deletedOlder = await deleteLogsInChunks(
      analysisID,
      olderThanCutoff,
      ANALYSIS_LOG_RETENTION_CALL_LIMIT - deletedWithoutTimestamp,
    );
    return deletedWithoutTimestamp + deletedOlder;
  }

  // Fewer than `max_lines` logs carry a timestamp: they all stay, and logs without one fill the remaining room.
  const total = await mainDB.write
    .count({ amount: "*" })
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .first();

  const excess = Number(total?.amount ?? 0) - query.max_lines;
  if (excess <= 0) {
    return 0;
  }

  return await deleteLogsInChunks(
    analysisID,
    withoutTimestamp,
    Math.min(excess, ANALYSIS_LOG_RETENTION_CALL_LIMIT),
  );
}

export default applyAnalysisLogRetention;
