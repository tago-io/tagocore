import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { DatabaseModule } from "@tago-io/tcore-sdk";
import knex, { type Knex } from "knex";
import type { Config } from "../types.ts";

const __filename = fileURLToPath(import.meta.url);
const dirname__ = dirname(__filename);

export interface IDatabaseConnection {
  read: Knex;
  write: Knex;
}

const mainDB = {} as IDatabaseConnection;

const deviceDB = {} as IDatabaseConnection;

const migrationConfig: Knex.MigratorConfig = {
  tableName: "migrations",
  directory: path.join(dirname__, "..", "Migrations"),
  // ! FIX Error: The migration directory is corrupt, the following files are missing:
  disableMigrationsListValidation: true,
};

interface IConnectionOptions {
  pool?: { min_pool?: number; max_pool?: number };
}

function createConnection(
  connection: Knex.MySqlConnectionConfig,
  options?: IConnectionOptions,
): Knex {
  return knex({
    client: "mysql2",
    connection: {
      charset: "utf8",
      timezone: "utc",
      ...connection,
    },
    pool: {
      max: options?.pool?.max_pool,
      min: options?.pool?.min_pool,
    },
  });
}

/**
 * Sets up the knex connection.
 */
export async function setupKnex(this: DatabaseModule, config: Config) {
  try {
    this.showMessage("info", "Testing connection");

    if (!config.main_read_host && !config.main_read_port) {
      return;
    }

    setupConnections(config);

    await testDatabaseConnection();

    this.showMessage("info", "Configuring database");

    await mainDB.write.migrate.latest(migrationConfig);

    this.showMessage("info", "Database is ready!");
  } catch (e: any) {
    this.hideMessage();
    throw e;
  }
}

interface ISSL {
  ca?: string;
  cert?: string;
  key?: string;
  cipher?: string;
  verify: boolean;
}

function setupSSL(ssl: ISSL): Knex.MariaSslConfiguration {
  const file = (path?: string) => {
    if (!path) {
      return undefined;
    }
    return fs.readFileSync(path).toString();
  };

  return {
    ca: file(ssl.ca),
    cert: file(ssl.cert),
    cipher: file(ssl.cipher),
    key: ssl.key,
    rejectUnauthorized: ssl.verify,
  };
}

function setupConnections(config: Config) {
  const mainReadConnection: Knex.MySqlConnectionConfig = {
    database: config.main_database,
    host: config.main_read_host,
    port: config.main_read_port,
    user: config.main_user,
    password: config.main_password,
    timezone: "local",
  };

  const mainOptions: IConnectionOptions = {
    pool: { max_pool: config.main_max_pool, min_pool: config.main_min_pool },
  };

  let deviceOptions = mainOptions;

  if (config.main_use_ssl) {
    mainReadConnection.ssl = setupSSL({
      verify: config.main_ssl_verify_server_cert,
      ca: config.main_ssl_ca_cert,
      key: config.main_ssl_key,
      cert: config.main_ssl_cert,
      cipher: config.main_ssl_cipher,
    });
  }

  const mainWriteConnection = mainReadConnection;

  if (config.main_connection === "read_write") {
    mainWriteConnection.host = config.main_write_host;
  }

  let deviceReadConnection: Knex.MySqlConnectionConfig = {
    ...mainReadConnection,
    database: config.device_database,
  };

  let deviceWriteConnection: Knex.MySqlConnectionConfig = {
    ...mainWriteConnection,
    database: config.device_database,
  };

  if (config.use_device_connection) {
    deviceReadConnection = {
      ...deviceReadConnection,
      database: config.device_database,
      host: config.device_read_host,
      port: config.device_read_port,
      user: config.device_user,
      password: config.device_password,
    };

    deviceOptions = {
      pool: {
        max_pool: config.device_max_pool,
        min_pool: config.device_min_pool,
      },
    };

    if (config.device_use_ssl) {
      deviceReadConnection.ssl = setupSSL({
        verify: config.device_ssl_verify_server_cert,
        ca: config.device_ssl_ca_cert,
        key: config.device_ssl_key,
        cert: config.device_ssl_cert,
        cipher: config.device_ssl_cipher,
      });
    } else {
      deviceReadConnection.ssl = undefined;
    }

    deviceWriteConnection = deviceReadConnection;

    if (config.device_connection === "read_write") {
      deviceWriteConnection.host = config.device_write_host;
    }
  }

  mainDB.read = createConnection(mainReadConnection, mainOptions);
  mainDB.write = createConnection(mainWriteConnection, mainOptions);
  deviceDB.read = createConnection(deviceReadConnection, deviceOptions);
  deviceDB.write = createConnection(deviceWriteConnection, deviceOptions);
}

/**
 * Destroys the knex connection.
 */
export async function destroyKnex(this: DatabaseModule) {
  try {
    this.showMessage("info", "Closing connections");

    mainDB?.read?.destroy();
    mainDB?.write?.destroy();
    deviceDB?.read?.destroy();
    deviceDB?.write?.destroy();

    this.showMessage("info", "Connection closed");
  } catch (e) {
    this.hideMessage();

    console.error(e);
    throw e;
  }
}

/**
 * Tests the connection to the database.
 **/
async function testDatabaseConnection() {
  try {
    console.info("Establishing database connection");

    await mainDB?.read?.raw("SELECT 1");
    await mainDB?.write?.raw("SELECT 1");

    await deviceDB?.read?.raw("SELECT 1");
    await deviceDB?.write?.raw("SELECT 1");

    console.info("Connected to database");
  } catch (e: any) {
    if (typeof e?.code === "string") {
      switch (e.code as string) {
        case "ENOTFOUND":
          throw new Error("Could not connect to database");
        case "ECONNREFUSED":
          throw new Error(
            `Connection to ${e.address}:${e.port} refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections`,
          );
        case "28P01":
          throw new Error("Authorization denied");
        case "3D000":
          throw new Error("Database does not exist");
      }
    }
    throw e;
  }
}

export { mainDB, deviceDB };
