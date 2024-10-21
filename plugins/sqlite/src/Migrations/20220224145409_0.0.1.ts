import type { Knex } from "knex";

/**
 * Bumps up to version 0.0.1 of tcore.
 */
export async function up(knex: Knex) {
  if (!(await knex.schema.hasTable("device"))) {
    await knex.schema.createTable("device", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.boolean("active");
      table.json("tags");
      table.string("bucket", 24);
      table.string("connector", 24);
      table.string("network", 24);
      table.text("payload_parser");
      table.timestamp("last_input");
      table.timestamp("last_output");
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table.timestamp("inspected_at");
      table.timestamp("last_retention");
      table.string("chunk_period");
      table.integer("chunk_retention");
    });
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

  if (!(await knex.schema.hasTable("analysis"))) {
    await knex.schema.createTable("analysis", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.boolean("active");
      table.json("tags");
      table.text("binary_path");
      table.text("file_path");
      table.json("options");
      table.json("variables");
      table.timestamp("last_run");
      table.timestamp("created_at");
      table.timestamp("updated_at");
    });
  }

  if (!(await knex.schema.hasTable("analysis_log"))) {
    await knex.schema.createTable("analysis_log", (table) => {
      table.timestamp("timestamp");
      table.string("analysis_id", 24);
      table.text("message");
      table.boolean("error");
    });
  }

  if (!(await knex.schema.hasTable("action"))) {
    await knex.schema.createTable("action", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.boolean("active");
      table.json("tags");
      table.json("action");
      table.json("device_info");
      table.json("trigger");
      table.timestamp("last_triggered");
      table.timestamp("created_at");
      table.timestamp("updated_at");
      table.text("type");
      table.boolean("lock");
    });
  }

  if (!(await knex.schema.hasTable("device_token"))) {
    await knex.schema.createTable("device_token", (table) => {
      table.string("token", 40).primary();
      table.string("name", 100);
      table.string("permission", 10);
      table.string("expire_time", 100);
      table.string("device_id", 24);
      table.string("network_id", 24);
      table.text("serie_number");
      table.text("last_authorization");
      table.timestamp("created_at");
    });
  }

  if (!(await knex.schema.hasTable("device_params"))) {
    await knex.schema.createTable("device_params", (table) => {
      table.string("id", 24).primary();
      table.text("key");
      table.text("value");
      table.boolean("sent");
      table.string("device_id", 24);
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

  if (!(await knex.schema.hasTable("statistic"))) {
    await knex.schema.createTable("statistic", (table) => {
      table.timestamp("time").primary();
      table.integer("input");
      table.integer("output");
    });
  }
}

/**
 * ! Shouldn't really happen, but ok
 * Bumps back to before every installing tcore.
 */
export async function down(knex: Knex) {
  if (await knex.schema.hasTable("device")) {
    await knex.schema.dropTable("device");
  }

  if (await knex.schema.hasTable("bucket")) {
    await knex.schema.dropTable("bucket");
  }

  if (await knex.schema.hasTable("analysis_log")) {
    await knex.schema.dropTable("analysis_log");
  }

  if (await knex.schema.hasTable("action")) {
    await knex.schema.dropTable("action");
  }

  if (await knex.schema.hasTable("device_token")) {
    await knex.schema.dropTable("device_token");
  }

  if (await knex.schema.hasTable("device_params")) {
    await knex.schema.dropTable("device_params");
  }

  if (await knex.schema.hasTable("device_connector")) {
    await knex.schema.dropTable("device_connector");
  }

  if (await knex.schema.hasTable("device_network")) {
    await knex.schema.dropTable("device_network");
  }

  if (await knex.schema.hasTable("statistic")) {
    await knex.schema.dropTable("statistic");
  }
}
