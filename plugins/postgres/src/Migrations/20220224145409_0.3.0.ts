import type { Knex } from "knex";

/**
 * Bumps up to version 0.0.1 of tagocore.
 */
export async function up(knex: Knex) {
  if (!(await knex.schema.hasTable("device"))) {
    await knex.schema.createTable("device", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.boolean("active");
      table.specificType("tags", "_jsonb");
      table.specificType("encoder_stack", "_varchar(100)");
      table.string("type", 20);
      table.string("data_retention", 30);
      table.text("payload_parser");
      table.timestamp("last_input").nullable();
      table.timestamp("last_output").nullable();
      table.timestamp("created_at").nullable();
      table.timestamp("updated_at").nullable();
      table.timestamp("inspected_at").nullable();
    });
  }

  if (!(await knex.schema.hasTable("analysis"))) {
    await knex.schema.createTable("analysis", (table) => {
      table.string("id", 24).primary();
      table.string("name", 100);
      table.boolean("active");
      table.specificType("tags", "_jsonb");
      table.text("binary_path");
      table.text("file_path");
      table.json("options");
      table.specificType("variables", "_jsonb");
      table.timestamp("last_run").nullable();
      table.timestamp("created_at").nullable();
      table.timestamp("updated_at").nullable();
    });
  }

  if (!(await knex.schema.hasTable("analysis_log"))) {
    await knex.schema.createTable("analysis_log", (table) => {
      table.timestamp("timestamp").nullable();
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
      table.specificType("tags", "_jsonb");
      table.json("action");
      table.json("device_info");
      table.json("trigger");
      table.timestamp("last_triggered").nullable();
      table.timestamp("created_at").nullable();
      table.timestamp("updated_at").nullable();
      table.text("type");
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
      table.timestamp("created_at").nullable();
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

  if (!(await knex.schema.hasTable("statistic"))) {
    await knex.schema.createTable("statistic", (table) => {
      table.timestamp("time").defaultTo(knex.fn.now()).primary();
      table.integer("input");
      table.integer("output");
    });
  }
}

/**
 * Bumps back to before every installing tagocore.
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

  if (await knex.schema.hasTable("statistic")) {
    await knex.schema.dropTable("statistic");
  }
}
