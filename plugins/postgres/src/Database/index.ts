import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { DatabaseModule } from "@tago-io/tcore-sdk";
import knex, { type Knex } from "knex";
import pg from "pg";
import type { Config } from "../types.ts";

const __filename = fileURLToPath(import.meta.url);
const dirname__ = dirname(__filename);

const types = pg.types;
// @ts-ignore
const { arrayParser } = types;

const int8Parser = (val) => Number.parseInt(val, 10);

const _INT8 = 1016;

// ? Int8 in node is string, this workaround make it as Number.
types.setTypeParser(types.builtins.INT8, int8Parser);
// @ts-ignore
types.setTypeParser(_INT8, (array) =>
  arrayParser.create(array, int8Parser).parse(),
);

export interface IDatabaseConnection {
  read: Knex;
  write: Knex;
}

const mainDB = {} as IDatabaseConnection;

const deviceDB = {} as IDatabaseConnection;

const migrationConfig: Knex.MigratorConfig = {
  tableName: "migrations",
  directory: path.join(dirname__, "..", "Migrations"),
  //  TODO:(rc) there was a "FIX Error: migration directory is corrupt" here, decide what to do later in the RC
  disableMigrationsListValidation: true,
};

interface IConnectionOptions {
  pool?: { min_pool?: number; max_pool?: number };
  schema: string;
}

function createConnection(
  connection: Knex.PgConnectionConfig,
  options?: IConnectionOptions,
): Knex {
  return knex({
    client: "pg",
    connection: {
      charset: "utf8",
      timezone: "utc",
      ...connection,
      types,
    },
    pool: {
      max: options?.pool?.max_pool,
      min: options?.pool?.min_pool,
    },
    searchPath: [options?.schema || "public"],
  });
}

/**
 * Sets up the knex connection.
 */
async function setupKnex(this: DatabaseModule, config: Config) {
  config.device_schema = "tcore_device";
  config.main_schema = "tcore";

  try {
    this.showMessage("info", "Testing connection");

    if (!config.main_read_host && !config.main_read_port) {
      return;
    }

    setupConnections(config);

    await testDatabaseConnection();

    this.showMessage("info", "Configuring database");

    await mainDB.write.schema.createSchemaIfNotExists(config.main_schema);
    await deviceDB.write.schema.createSchemaIfNotExists(config.device_schema);
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
  const mainReadConnection: Knex.PgConnectionConfig = {
    database: config.main_database,
    host: config.main_read_host,
    port: config.main_read_port,
    user: config.main_user,
    password: config.main_password,
  };

  const mainOptions: IConnectionOptions = {
    pool: { max_pool: config.main_max_pool, min_pool: config.main_min_pool },
    schema: config.main_schema,
  };

  let deviceOptions = { ...mainOptions };

  deviceOptions.schema = config.device_schema;

  if (config.main_use_ssl) {
    mainReadConnection.ssl = setupSSL({
      verify: config.main_ssl_verify_server_cert,
      ca: config.main_ssl_ca_cert,
      key: config.main_ssl_key,
      cert: config.main_ssl_cert,
      cipher: config.main_ssl_cipher,
    });
  }

  const mainWriteConnection = { ...mainReadConnection };

  if (config.main_connection === "read_write") {
    mainWriteConnection.host = config.main_write_host;
  }

  let deviceReadConnection = { ...mainReadConnection };

  let deviceWriteConnection: Knex.PgConnectionConfig = {
    ...mainWriteConnection,
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
      schema: config.device_schema,
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

    deviceWriteConnection = { ...deviceReadConnection };

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
async function destroyKnex(this: DatabaseModule) {
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

export { mainDB, deviceDB, setupKnex, destroyKnex };
