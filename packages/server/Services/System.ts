import pkg from "../../../package.json" with { type: "json" };
import { getAccountAmount } from "./Account/Account.ts";
import { getMainDatabaseModule } from "./Plugins.ts";
import { getMainSettings } from "./Settings.ts";

/**
 * Retrieves the version of the tcore application.
 */
export function getVersion() {
  return pkg.version;
}

/**
 * Retrieves the status of the application:
 * - is the database configured?
 * - is at least one account registered?
 * - is the master password set?
 */
export async function getStatus() {
  const settings = await getMainSettings();
  const dbModule = await getMainDatabaseModule();
  const output: any = {
    version: getVersion(),
    database: { configured: true },
    master_password: !!settings.master_password,
    account: (await getAccountAmount().catch(() => 0)) > 0,
  };

  if (!settings.database_plugin || !dbModule) {
    output.database.configured = false;
  } else if (dbModule.error || dbModule.plugin.error) {
    output.database.error = true;
  }

  return output;
}

/**
 * Exits the application.
 */
export async function exitSystem(code: number) {
  process.exit(code);
}
