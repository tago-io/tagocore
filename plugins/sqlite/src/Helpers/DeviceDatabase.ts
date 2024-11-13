import path from "node:path";
import { helpers } from "@tago-io/tcore-sdk";
import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import knex, { type Knex } from "knex";

/**
 * Map of all device connections.
 */
const connections = new Map<string, Knex>();

/**
 * Retrieves or creates a connection with a device database.
 */
export async function getDeviceConnection(
  id: TGenericID,
  type: TDeviceType,
): Promise<Knex> {
  if (!connections.has(id)) {
    await createDeviceConnection(id, type);
  }
  return connections.get(id) as Knex;
}

/**
 * Destroys a device connection.
 */
export async function destroyDeviceConnection(id: TGenericID) {
  await helpers
    .deleteFileOrFolder(path.join("devices", `${id}.db`))
    .catch(() => false);
  await connections.get(id)?.destroy();
  connections.delete(id);
}

/**
 * Creates a new connection. This will check if the file exists and
 * create the structure if it doesn't.
 */
export async function createDeviceConnection(
  id: TGenericID,
  type: TDeviceType,
) {
  // creates the devices folder in case it doesn't exist:
  await helpers.createFolder("devices");

  // gets the full filename for the plugin storage:
  const filename = await helpers.getFileURI(path.join("devices", `${id}.db`));

  const connection = knex({
    client: "sqlite3",
    connection: { filename },
    useNullAsDefault: true,
  });

  if (!(await connection.schema.hasTable("data"))) {
    await connection.schema.createTable("data", (table) => {
      table.string("id", 24).primary();
      table.string("variable", 100);
      table.string("type", 15);
      table.text("value");
      table.string("unit", 100);
      table.string("group", 24);
      table.json("location");
      table.json("metadata");
      table.timestamp("time");
      table.timestamp("created_at");
      table.timestamp("chunk_timestamp_start");
      table.timestamp("chunk_timestamp_end");
      table.string("serie", 100);

      if (type === "mutable") {
        // added for version 0.3.3
        table.timestamp("updated_at");
        table.index(["updated_at"]);
      }

      table.index(["variable", "value", "time"]);
      table.index(["variable", "time"]);
      table.index(["variable", "created_at"]);
      table.index(["time"]);
      table.index(["group"]);
      table.index(["created_at"]);
    });
  }

  if (
    type === "mutable" &&
    !(await connection.schema.hasColumn("data", "updated_at"))
  ) {
    // < 0.3.3 versions that were created without the `updated_at`
    await connection.schema.table("data", (table) => {
      table.timestamp("updated_at");
      table.index(["updated_at"]);
    });
  }

  if (
    type === "immutable" &&
    !(await connection.schema.hasColumn("data", "chunk_timestamp_start"))
  ) {
    // < 0.6.0 versions that were created without the `chunk_timestamp` fields
    await connection.schema.table("data", (table) => {
      table.timestamp("chunk_timestamp_start");
      table.timestamp("chunk_timestamp_end");
    });
  }

  connections.set(id, connection);
}
