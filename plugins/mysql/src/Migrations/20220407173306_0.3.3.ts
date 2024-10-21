import type { Knex } from "knex";

/**
 * Bumps up to version 0.3.3.
 */
export async function up(knex: Knex) {
  await knex.schema.table("device_token", (table) => {
    table
      .foreign("device_id")
      .references("id")
      .inTable("device")
      .onDelete("CASCADE");
  });

  await knex.schema.table("device_params", (table) => {
    table
      .foreign("device_id")
      .references("id")
      .inTable("device")
      .onDelete("CASCADE");
  });

  await knex.schema.table("analysis_log", (table) => {
    table
      .foreign("analysis_id")
      .references("id")
      .inTable("analysis")
      .onDelete("CASCADE");
  });
}

/**
 * Bumps down to version 0.3.2.
 */
export async function down(knex: Knex) {
  await knex.schema.table("device_token", (table) => {
    table.dropForeign("device_id");
  });

  await knex.schema.table("device_params", (table) => {
    table.dropForeign("device_id");
  });
}
