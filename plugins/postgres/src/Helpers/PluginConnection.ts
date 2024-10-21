import type { Knex } from "knex";
import { mainDB } from "../Database/index.ts";

const schemaName = "tcore_plugin_storage" as const;

/**
 * Retrieves or creates a connection with a plugin database.
 */
export async function getPluginConnection(id: string) {
  await mainDB.write.schema.createSchemaIfNotExists(schemaName);

  if (!(await mainDB.write.schema.withSchema(schemaName).hasTable(id))) {
    await mainDB.write.schema
      .withSchema(schemaName)
      .createTable(id, (table) => {
        table.text("key").primary();
        table.text("type");
        table.binary("value");
        table.timestamp("created_at");
      });
  }

  const connection = {
    read: createConnection(mainDB.read, id),
    write: createConnection(mainDB.write, id),
  };

  return connection;
}

function createConnection(knex: Knex, id: string) {
  return knex(knex.ref(id).withSchema(schemaName));
}
