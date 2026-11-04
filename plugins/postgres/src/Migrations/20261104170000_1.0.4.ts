import type { Knex } from "knex";

/**
 * Bumps up to version 1.0.4.
 *
 * Built without `CONCURRENTLY`: a failed concurrent build leaves an INVALID index
 * that `IF NOT EXISTS` would then skip on every start.
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
