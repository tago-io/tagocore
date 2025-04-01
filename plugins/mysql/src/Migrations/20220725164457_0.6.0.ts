import type { Knex } from "knex";

/**
 * Bumps up to version 0.6.0.
 */
export async function up(knex: Knex) {
  await knex.schema
    .raw(
      `SELECT *  FROM information_schema.COLUMNS  WHERE TABLE_NAME = 'device'  AND COLUMN_NAME = 'last_retention'`,
    )
    .then(async (data) => {
      if (data[0].length === 0) {
        await knex.schema.table("device", (table) => {
          table.timestamp("last_retention").nullable();
          table.string("chunk_period").nullable();
          table.integer("chunk_retention").nullable();
        });
      }
    });
}

/**
 * Bumps down.
 */
export async function down(knex: Knex) {
  await knex.schema.table("device", (table) => {
    table.dropColumn("last_retention");
    table.dropColumn("chunk_period");
    table.dropColumn("chunk_retention");
  });
}
