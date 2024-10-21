import type { Knex } from "knex";

/**
 * Bumps up to version 0.3.0.
 */
export async function up(knex: Knex) {
  if (await knex.schema.hasColumn("device", "bucket")) {
    await knex.schema.alterTable("device", (table) =>
      table.dropColumn("bucket"),
    );
  }

  if (!(await knex.schema.hasColumn("device", "encoder_stack"))) {
    await knex.schema.table("device", (table) => table.text("encoder_stack"));
  }

  if (!(await knex.schema.hasColumn("device", "type"))) {
    await knex.schema.table("device", (table) => table.string("type", 20));
  }

  if (!(await knex.schema.hasColumn("device", "data_retention"))) {
    await knex.schema.table("device", (table) =>
      table.string("data_retention", 30),
    );
  }

  if (await knex.schema.hasTable("bucket")) {
    await knex.schema.dropTable("bucket");
  }

  if (await knex.schema.hasTable("device_connector")) {
    await knex.schema.dropTable("device_connector");
  }

  if (await knex.schema.hasTable("device_network")) {
    await knex.schema.dropTable("device_network");
  }
}

/**
 * Bumps back to version 0.0.1.
 */
export async function down(knex: Knex) {
  if (!(await knex.schema.hasColumn("device", "bucket"))) {
    await knex.schema.table("device", (table) => table.string("bucket", 24));
  }

  if (await knex.schema.hasColumn("device", "encoder_stack")) {
    await knex.schema.alterTable("device", (table) =>
      table.dropColumn("encoder_stack"),
    );
  }

  if (!(await knex.schema.hasTable("bucket"))) {
    await knex.schema.createTable("bucket", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.json("tags");
      table.string("data_retention", 24);
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  if (!(await knex.schema.hasTable("device_connector"))) {
    await knex.schema.createTable("device_connector", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.string("network", 24);
    });
  }

  if (!(await knex.schema.hasTable("device_network"))) {
    await knex.schema.createTable("device_network", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
    });
  }
}
