import type { Knex } from "knex";

/**
 * Bumps up to version 0.5.0.
 */
export async function up(knex: Knex) {
  if (!(await knex.schema.hasTable("account"))) {
    await knex.schema.createTable("account", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.string("username", 100).unique();
      table.text("password");
      table.string("password_hint", 100);
      table.timestamp("created_at").nullable();
    });
  }

  if (!(await knex.schema.hasTable("account_token"))) {
    await knex.schema.createTable("account_token", (table) => {
      table.string("token", 40).primary();
      table.string("account_id", 24);
      table.string("expire_time", 100);
      table.string("permission", 40);
      table.timestamp("created_at").nullable();

      table
        .foreign("account_id")
        .references("id")
        .inTable("account")
        .onDelete("CASCADE");
    });
  }
}

/**
 * Bumps down.
 */
export async function down(knex: Knex) {
  if (await knex.schema.hasTable("account_token")) {
    await knex.schema.dropTable("account_token");
  }

  if (await knex.schema.hasTable("account")) {
    await knex.schema.dropTable("account");
  }
}
