import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import type { Knex } from "knex";
import { deviceDB } from "../Database/index.ts";

/**
 * Creates a new connection. This will check if the file exists and
 * create the structure if it doesn't.
 */
export async function getDeviceConnection(id: TGenericID, type: TDeviceType) {
  if (!(await deviceDB.write.schema.hasTable(id))) {
    await deviceDB.write.schema.createTable(id, (table) => {
      table.string("id", 24).primary();
      table.string("variable", 100);
      table.string("type", 15);
      table.text("value");
      table.string("unit", 100);
      table.string("group", 24);
      table.json("location");
      table.json("metadata");
      table.timestamp("time").nullable();
      table.timestamp("created_at").nullable();
      table.timestamp("chunk_timestamp_start");
      table.timestamp("chunk_timestamp_end");

      if (type === "mutable") {
        table.timestamp("updated_at");
        table.index(["updated_at"]);
      }

      table.index(["variable", "time"]);
      table.index(["variable", "value", "created_at"]);
      table.index(["variable", "created_at"]);
      table.index(["time"]);
      table.index(["group"]);
      table.index(["created_at"]);
    });
  }

  if (
    type === "immutable" &&
    !(await deviceDB.write.schema.hasColumn(id, "chunk_timestamp_start"))
  ) {
    // < 0.6.0 versions that were created without the `chunk_timestamp` fields
    await deviceDB.write.schema.table(id, (table) => {
      table.timestamp("chunk_timestamp_start");
      table.timestamp("chunk_timestamp_end");
    });
  }

  return {
    read: getConnection(deviceDB.read, id),
    write: getConnection(deviceDB.write, id),
  };
}

type Tables = "data";

function getConnection(client: Knex, id: string) {
  return (table: Tables) => {
    if (table === "data") {
      return client(id);
    }
  };
}
