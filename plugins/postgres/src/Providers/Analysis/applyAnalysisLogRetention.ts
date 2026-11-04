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
 * Deletes, in chunks, up to `limit` logs of an analysis that match `filter`.
 */
async function deleteLogsInChunks(
  analysisID: TGenericID,
  filter: (builder: Knex.QueryBuilder) => void,
  limit: number,
): Promise<void> {
  let remaining = limit;

  while (remaining > 0) {
    const size = Math.min(DELETE_CHUNK_SIZE, remaining);
    const chunk = mainDB.write
      .select("ctid")
      .from("analysis_log")
      .where("analysis_id", analysisID)
      .where(filter)
      .limit(size);

    const deleted = await mainDB.write
      .delete()
      .from("analysis_log")
      .whereIn("ctid", chunk);

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
    const olderThanCutoff = (builder: Knex.QueryBuilder) => {
      builder
        .where("timestamp", "<", cutoff.timestamp)
        .orWhereNull("timestamp");
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
    const withoutTimestamp = (builder: Knex.QueryBuilder) => {
      builder.whereNull("timestamp");
    };
    await deleteLogsInChunks(analysisID, withoutTimestamp, excess);
  }
}

export default applyAnalysisLogRetention;
