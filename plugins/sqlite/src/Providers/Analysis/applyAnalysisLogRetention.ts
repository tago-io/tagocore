import {
  ANALYSIS_LOG_RETENTION_CALL_LIMIT,
  type IDatabaseApplyAnalysisLogRetentionQuery,
  type TGenericID,
} from "@tago-io/tcore-sdk/types";
import type { Knex } from "knex";
import { knexClient } from "../../knex.ts";

/**
 * Most rows a single delete removes, so a large trim lets other queries run between chunks.
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
    // SQLite sorts NULL first in ascending order, so logs without a timestamp, the oldest, go first. The index
    // already holds this order, so it costs no sort.
    const chunk = knexClient
      .select("rowid")
      .from("analysis_log")
      .where("analysis_id", analysisID)
      .where(filter)
      .orderBy("timestamp", "asc")
      .limit(size);

    const chunkDeleted = await knexClient
      .delete()
      .from("analysis_log")
      .whereIn("rowid", chunk);

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
 * Logs without a timestamp count as the oldest, and logs that share the cutoff timestamp are all kept.
 */
async function applyAnalysisLogRetention(
  analysisID: TGenericID,
  query: IDatabaseApplyAnalysisLogRetentionQuery,
): Promise<number> {
  const cutoff = await knexClient
    .first("timestamp")
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .whereNotNull("timestamp")
    .orderBy("timestamp", "desc")
    .offset(query.max_lines - 1);

  if (cutoff) {
    const olderThanCutoff = (builder: Knex.QueryBuilder) => {
      builder
        .where("timestamp", "<", cutoff.timestamp)
        .orWhereNull("timestamp");
    };
    return await deleteLogsInChunks(
      analysisID,
      olderThanCutoff,
      ANALYSIS_LOG_RETENTION_CALL_LIMIT,
    );
  }

  // Fewer than `max_lines` logs carry a timestamp: they all stay, and logs without one fill the remaining room.
  const total = await knexClient
    .count({ amount: "*" })
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .first();

  const excess = Number(total?.amount ?? 0) - query.max_lines;
  if (excess <= 0) {
    return 0;
  }

  const withoutTimestamp = (builder: Knex.QueryBuilder) => {
    builder.whereNull("timestamp");
  };
  return await deleteLogsInChunks(
    analysisID,
    withoutTimestamp,
    Math.min(excess, ANALYSIS_LOG_RETENTION_CALL_LIMIT),
  );
}

export default applyAnalysisLogRetention;
