import type { Knex } from "knex";

/**
 * Bumps up to version 0.4.1.
 */
export async function up(knex: Knex) {
  await knex.schema
    .raw(
      `SELECT *  FROM information_schema.COLUMNS  WHERE TABLE_NAME = 'action'  AND COLUMN_NAME = 'lock'`,
    )
    .then(async (data) => {
      if (data[0].length === 0) {
        await knex.schema.table("action", (table) => {
          table.boolean("lock");
        });
      }
    });
}

/**
 * Bumps down to version 0.3.3.
 */
export async function down(knex: Knex) {
  await knex.schema.table("action", (table) => table.dropColumn("lock"));
}
