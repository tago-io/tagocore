import type { Knex } from "knex";

const ANALYSIS_ID_TIMESTAMP_INDEX = "analysis_log_analysis_id_timestamp_index";
const ANALYSIS_ID_INDEX = "analysis_log_analysis_id_index";

/**
 * Whether `analysis_log` already has an index named `indexName`.
 */
async function hasAnalysisLogIndex(
  knex: Knex,
  indexName: string,
): Promise<boolean> {
  const [rows] = await knex.raw(
    "SELECT * FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'analysis_log' AND INDEX_NAME = ?",
    [indexName],
  );
  return rows.length > 0;
}

/**
 * Bumps up to version 1.0.4.
 */
export async function up(knex: Knex) {
  if (await hasAnalysisLogIndex(knex, ANALYSIS_ID_TIMESTAMP_INDEX)) {
    return;
  }

  await knex.schema.table("analysis_log", (table) => {
    table.index(["analysis_id", "timestamp"], ANALYSIS_ID_TIMESTAMP_INDEX);
  });
}

/**
 * Bumps down to version 1.0.3.
 *
 * MySQL drops the implicit foreign key index once the composite index covers
 * `analysis_id`, so the foreign key needs its own index back first. An earlier
 * `down` may have added it already.
 */
export async function down(knex: Knex) {
  const hasAnalysisIDIndex = await hasAnalysisLogIndex(knex, ANALYSIS_ID_INDEX);

  await knex.schema.table("analysis_log", (table) => {
    if (!hasAnalysisIDIndex) {
      table.index(["analysis_id"], ANALYSIS_ID_INDEX);
    }
    table.dropIndex(["analysis_id", "timestamp"], ANALYSIS_ID_TIMESTAMP_INDEX);
  });
}
