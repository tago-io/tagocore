import fs from "node:fs";
import { oraLog, oraLogError } from "../Helpers/log.ts";
import { listPluginFolders } from "../Services/Plugins.ts";
import { getMainSettings, getPluginSettings } from "../Services/Settings.ts";
import Plugin from "./Plugin/Plugin.ts";
import { generatePluginID } from "./PluginID.ts";
import { getPluginPackageJSON } from "./PluginPackage.ts";

/**
 * List of plugins paths that are built-in as soon as tcore boots up.
 * This is used for development only, and it should be empty on production builds.
 */
export const DEV_BUILT_IN_PLUGINS: string[] = [];

/**
 * Map containing the a key with the name of a plugin and the value
 * as an instance of the Plugin class.
 */
export const plugins: Map<string, Plugin> = new Map();

/**
 */
export async function startPlugin(folder: string) {
  const plugin = new Plugin(folder);
  const exists = plugins.get(plugin.id);
  if (exists) {
    // plugin already running and already inserted in the list
    throw new Error("Plugin is already running");
  }

  plugins.set(plugin.id, plugin);

  const settings = await getPluginSettings(plugin.id);
  if (settings.disabled) {
    await plugin.disable();
  } else {
    await plugin.start();
  }

  return plugin;
}

/**
 * Sorts all folders based on their priority:
 * First the main database plugin then the other plugins.
 */
export async function sortPluginFoldersByPriority(
  folders: string[],
): Promise<string[]> {
  const settings = await getMainSettings();
  const dbModuleID = String(settings.database_plugin).split(":")?.[0];
  const plugins: { [key: string]: string[] } = {
    highest: [],
    databases: [],
    others: [],
  };

  for (const folder of folders) {
    const pkg = await getPluginPackageJSON(folder);
    if (!pkg) {
      continue;
    }

    const id = generatePluginID(pkg.name);
    const isHighest = pkg?.tcore?.priority === "highest";
    const isDatabase =
      dbModuleID === id || pkg?.tcore?.types?.includes("database");

    if (isHighest) {
      // plugin has request highest priority to start
      plugins.highest.push(folder);
    } else if (isDatabase) {
      // database plugins gets some priority over other plugins
      plugins.databases.push(folder);
    } else {
      // common plugin, not database
      plugins.others.push(folder);
    }
  }

  const result: string[] = [];
  result.push(...plugins.highest);
  result.push(...plugins.databases);
  result.push(...plugins.others);

  return result;
}

/**
 * Starts a single plugin from a folder and handle its errors.
 * If there is an error, it will be logged to the terminal.
 * If no errors are present in the plugin, it will say that the plugin is good to go.
 */
export async function startPluginAndHandleErrors(folder: string) {
  try {
    const plugin = await startPlugin(folder);

    const modules = [...plugin.modules.values()];
    const errors = modules.filter((x) => x.error);

    if (errors.length === 1 && errors[0].error) {
      // only one module threw an error, show a single line of error
      throw new Error(errors[0].error);
    }
    if (errors.length > 1) {
      // multiple modules threw errors, show multiline of errors, one for
      // each module that threw an error
      const msgs = errors.map((x) => `  - ${x.name}: ${x.error}`);
      const join = msgs.join("\n");
      throw new Error(`\n${join}`);
    }

    if (plugin.state === "started") {
      oraLog("api", `Started Plugin: ${plugin.tcoreName}`);
    } else if (plugin.state === "disabled") {
      oraLog("api", `Skipped Disabled Plugin: ${plugin.tcoreName}`);
    }
  } catch (ex: any) {
    const err = ex.message || ex;

    const pluginPkg = Plugin.getPackage(folder);
    const pluginName = pluginPkg.tcore?.name || pluginPkg.name;

    oraLogError("api", `Failed to start Plugin ${pluginName || ""}: ${err}`);
  }
}

/**
 * Initializes all the plugins.
 */
export async function startAllPlugins() {
  const folders = await listPluginFolders();
  const sorted = await sortPluginFoldersByPriority(folders);

  for (const folder of sorted) {
    if (fs.existsSync(folder)) {
      await startPluginAndHandleErrors(folder);
    }
  }
}
