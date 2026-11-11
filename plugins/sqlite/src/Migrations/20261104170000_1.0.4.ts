import type { Knex } from "knex";

/**
 * Bumps up to version 1.0.4.
 */
export async function up(knex: Knex) {
  await knex.raw(
    `CREATE INDEX IF NOT EXISTS analysis_log_analysis_id_timestamp_index ON analysis_log (analysis_id, "timestamp")`,
  );
}

/**
 * Bumps down to version 1.0.3.
 */
export async function down(knex: Knex) {
  await knex.raw(
    "DROP INDEX IF EXISTS analysis_log_analysis_id_timestamp_index",
  );
}
