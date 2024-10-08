import path from "path";
import { TGenericID } from "@tago-io/tcore-sdk/types";
import knex, { Knex } from "knex";
import { helpers } from "@tago-io/tcore-sdk";
import Dialect from "knex/lib/dialects/sqlite3";

/**
 * Map of all plugins connections.
 */
const connections = new Map<string, Knex>();

/**
 * Retrieves or creates a connection with a plugin database.
 */
export async function getPluginConnection(id: string): Promise<Knex> {
  if (!connections.has(id)) {
    await createPluginConnection(id);
  }
  return connections.get(id) as Knex;
}

/**
 * Creates a new connection. This will check if the file exists and
 * create the structure if it doesn't.
 */
async function createPluginConnection(id: TGenericID) {
  // creates the plugins folder in case it doesn't exist:
  await helpers.createFolder("plugins");

  // gets the full filename for the plugin storage:
  const filename = await helpers.getFileURI(path.join("plugins", `${id}.db`));

  const connection = knex({
    client: Dialect,
    connection: { filename },
    useNullAsDefault: true,
  });

  if (!(await connection.schema.hasTable("storage"))) {
    await connection.schema.createTable("storage", (table) => {
      table.text("key").primary();
      table.text("type");
      table.binary("value");
      table.timestamp("created_at");
    });
  }

  connections.set(id, connection);
}
