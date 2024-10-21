import type { Knex } from "knex";

/**
 * Bumps up to version 0.4.1.
 */
export async function up(knex: Knex) {
  await knex.schema.table("action", (table) => table.boolean("lock"));
}

/**
 * Bumps down to version 0.3.3.
 */
export async function down(knex: Knex) {
  await knex.schema.table("action", (table) => table.dropColumn("lock"));
}
