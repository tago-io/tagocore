import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const dirname_ = dirname(fileURLToPath(import.meta.url));

import knex, { type Knex } from "knex";

let knexClient: Knex;

const migrationConfig: Knex.MigratorConfig = {
  tableName: "migrations",
  directory: join(dirname_, "Migrations"),
  // Fixes the error: The migration directory is corrupt, the following files are missing:
  disableMigrationsListValidation: true,
};

/**
 * Sets up the knex connection.
 */
export async function setupKnex(data: any) {
  const filename = data.file;

  knexClient = knex({
    client: "better-sqlite3",
    connection: { filename },
    useNullAsDefault: true,
  });

  await knexClient.migrate.latest(migrationConfig);
  await knexClient.raw("PRAGMA foreign_keys = ON");
}

/**
 * Destroys the knex connection.
 */
export async function destroyKnex() {
  knexClient?.destroy();
}

export { knexClient };
