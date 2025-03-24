import { mainDB } from "../Database/index.ts";

/**
 * Retrieves or creates a connection with a plugin database.
 */
export async function getPluginConnection(id: string) {
  const tableName = `plugin_storage_${id}`;

  if (!(await mainDB.write.schema.hasTable(tableName))) {
    await mainDB.write.schema.createTable(tableName, (table) => {
      table.string("key", 255).primary();
      table.text("type");
      table.binary("value");
      table.timestamp("created_at");
    });
  }

  //  TODO:(rc) add reminder to remove this in v1
  await fixKeyIndex(tableName);

  const connection = {
    read: mainDB.read(tableName),
    write: mainDB.write(tableName),
  };

  return connection;
}

async function fixKeyIndex(tableName: string) {
  try {
    await mainDB.write.schema.alterTable(tableName, (table) => {
      table.string("key", 255).primary().alter();
    });
  } catch (e) {
    if (e?.code === "ER_DUP_ENTRY") {
      try {
        await mainDB.write.transaction(async (trx) => {
          const tmpTable = `${tableName}_tmp`;
          await trx.schema.renameTable(tableName, tmpTable);
          await trx.schema.createTable(tableName, (table) => {
            table.string("key", 255).primary();
            table.text("type");
            table.binary("value");
            table.timestamp("created_at");
          });

          await trx
            .insert(
              trx
                .select(["key", "type", "value", "created_at"])
                .from({ t1: tmpTable })
                .where(
                  "t1.created_at",
                  trx
                    .max("created_at")
                    .from({ t2: tmpTable })
                    .where("t1.key", trx.raw("t2.`key`")),
                )
                .groupBy("key"),
            )
            .into(tableName)
            .onConflict(["key"])
            .ignore();

          await trx.schema.dropTableIfExists(tmpTable);
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
}
