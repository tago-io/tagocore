import type { Knex } from "knex";

/**
 * Bumps up to version 1.0.4.
 */
export async function up(knex: Knex) {
  await knex.schema
    .raw(
      `SELECT * FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'analysis_log' AND INDEX_NAME = 'analysis_log_analysis_id_timestamp_index'`,
    )
    .then(async (data) => {
      if (data[0].length === 0) {
        await knex.schema.table("analysis_log", (table) => {
          table.index(
            ["analysis_id", "timestamp"],
            "analysis_log_analysis_id_timestamp_index",
          );
        });
      }
    });
}

/**
 * Bumps down to version 1.0.3.
 *
 * MySQL drops the implicit foreign key index once the composite index covers
 * `analysis_id`, so the foreign key needs its own index back first.
 */
export async function down(knex: Knex) {
  await knex.schema.table("analysis_log", (table) => {
    table.index(["analysis_id"]);
    table.dropIndex(
      ["analysis_id", "timestamp"],
      "analysis_log_analysis_id_timestamp_index",
    );
  });
}
