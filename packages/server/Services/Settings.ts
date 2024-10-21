import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type {
  IPluginSettings,
  IPluginSettingsModule,
  ISettings,
} from "@tago-io/tcore-sdk/types";
import {
  flattenConfigFields,
  getSystemName,
  getSystemSlug,
} from "@tago-io/tcore-shared";
import { rmdir } from "../Helpers/Files.ts";
import { loadYml, saveYml } from "../Helpers/Yaml.ts";
import {
  plugins,
  sortPluginFoldersByPriority,
  startPluginAndHandleErrors,
} from "../Plugins/Host.ts";
import { log } from "../index.ts";
import { compareAccountPasswordHash } from "./Account/AccountPassword.ts";
import {
  decryptPluginConfigPassword,
  encryptPluginConfigPassword,
} from "./Plugin/PluginPassword.ts";
import { startPluginModule } from "./Plugins.ts";

/**
 * Folder name to save the settings.
 */
const folderName =
  os.platform() === "win32" ? getSystemName() : `.${getSystemSlug()}`;

/**
 * Checks if the master password is correct.
 * @returns {boolean} True for correct, false for incorrect.
 */
export async function checkMasterPassword(
  masterPassword: string,
): Promise<boolean> {
  const settings = await getMainSettings();
  const matches = await compareAccountPasswordHash(
    masterPassword,
    settings.master_password || "",
  );
  return matches;
}

/**
 * Gets the dirpath of the application. The dirpath is the path
 * where the application data, settings, and plugins will be saved.
 */
export function getDirpath() {
  const dirpath =
    process.env.TCORE_DIRPATH || path.resolve(os.homedir(), folderName);
  return dirpath;
}

/**
 * Retrieves the main settings folder.
 */
export async function getMainSettingsFolder(): Promise<string> {
  const dirpath = getDirpath();
  const folder = path.resolve(dirpath);
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

/**
 * Retrieves the settings folder of a plugin.
 */
export async function getPluginSettingsFolder(
  pluginID: string,
): Promise<string> {
  const dirpath = getDirpath();
  const folder = path.resolve(dirpath, "PluginFiles", pluginID || "");
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

/**
 * Retrieves the main settings of the application.
 */
export async function getMainSettings(): Promise<ISettings> {
  const folder = await getMainSettingsFolder();
  const data = await loadYml(path.join(folder, `${getSystemSlug()}.yml`));

  const filesystem_plugin =
    process.env.TCORE_FILESYSTEM_PLUGIN || data.filesystem_plugin || "";
  const database_plugin =
    process.env.TCORE_DATABASE_PLUGIN || data.database_plugin || "";
  const queue_plugin =
    process.env.TCORE_QUEUE_PLUGIN || data.queue_plugin || "";
  const settings_folder = process.env.TCORE_SETTINGS_FOLDER || folder;
  const port = process.env.TCORE_PORT || data.port || "8888";
  const master_password = data.master_password || "";
  const version = data.version || "";
  const installed_plugins = data.installed_plugins || [];
  const custom_plugins = data.custom_plugins || [];

  const settings: ISettings = {
    filesystem_plugin,
    database_plugin,
    queue_plugin,
    port,
    settings_folder,
    master_password,
    version,
    installed_plugins,
    custom_plugins,
  };

  return settings;
}

/**
 * Terminate all non-built in plugins and removes the settings folder.
 */
export async function doFactoryReset(): Promise<void> {
  log("api", "Performing Factory Reset");

  const dirPath = await getMainSettingsFolder();
  const stoppedPlugins: string[] = [];
  const ignoredPlugins: string[] = [];

  // 1. we loop through the default plugins folder located at the dirPath
  // and then we delete every single plugin that is not being used
  const defaultPluginFolder = path.join(dirPath, "Plugins");
  const defaultPlugins = await fs.promises.readdir(defaultPluginFolder);
  for (const folder of defaultPlugins) {
    if (ignoredPlugins.includes(folder)) {
      continue;
    }

    const stat = fs.statSync(path.join(defaultPluginFolder, folder));
    if (!stat.isDirectory()) {
      continue;
    }

    const plugin = [...plugins.values()].find(
      (x) => x.folder === path.join(defaultPluginFolder, folder),
    );
    if (plugin) {
      stoppedPlugins.push(plugin.folder);
      await plugin.stop(true, 3000).catch(() => null);
      plugins.delete(plugin.id);
    }

    await rmdir(path.join(defaultPluginFolder, folder));
  }

  // 2. we delete the main configuration
  await rmdir(path.join(dirPath, "PluginFiles")).catch(() => null);
  await fs.promises
    .unlink(path.join(dirPath, `${getSystemSlug()}.yml`))
    .catch(() => null);

  // 4. we restart the plugins
  const sorted = await sortPluginFoldersByPriority(stoppedPlugins);
  for (const pluginFolder of sorted) {
    if (fs.existsSync(pluginFolder)) {
      await startPluginAndHandleErrors(pluginFolder);
    }
  }
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setMainSettings(data: ISettings): Promise<void> {
  const folder = await getMainSettingsFolder();
  await saveYml(data, path.join(folder, `${getSystemSlug()}.yml`));
}

/**
 * Sets the master password.
 */
export async function setMasterPassword(
  encryptedPassword: string,
): Promise<void> {
  const settings = await getMainSettings();
  settings.master_password = encryptedPassword;
  await setMainSettings(settings);
}

/**
 * Retrieves the settings of a plugin.
 */
export async function getPluginSettings(id: string): Promise<IPluginSettings> {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  const fileData = (await loadYml(filePath, {})) as IPluginSettings;

  for (const item of fileData.modules || []) {
    for (const key in item.values) {
      if (item.values[key]?.type === "password") {
        item.values[key] = decryptPluginConfigPassword(item.values[key].value);
      }
    }
  }

  return fileData;
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setPluginModulesSettings(id: string, values: any) {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  const plugin = plugins.get(id);
  const modules: IPluginSettingsModule[] = [];

  for (const item of values) {
    const module = plugin?.modules?.get(item.moduleID);
    const configs = flattenConfigFields(module?.setup.configs || []);
    const field = configs.find((x) => "field" in x && x.field === item.field);
    const isPassword = field?.type === "password";

    if (isPassword) {
      item.value = {
        type: "password",
        value: encryptPluginConfigPassword(item.value),
      };
    }

    const group = modules.find((x) => x.id === item.moduleID);
    if (group) {
      group.values[item.field] = item.value;
    } else {
      modules.push({ id: item.moduleID, values: { [item.field]: item.value } });
    }
  }

  const data: IPluginSettings = {
    disabled: plugin?.state === "disabled",
    modules,
  };

  await saveYml(data, filePath);

  if (plugin && plugin?.state !== "disabled" && plugin.state !== "started") {
    await plugin.start();
  }

  const cache = {};
  for (const item of values) {
    if (!cache[item.moduleID]) {
      cache[item.moduleID] = true;
      await startPluginModule(id, item.moduleID);
    }
  }
}

/**
 */
export async function setPluginSettings(id: string, settings: IPluginSettings) {
  const root = await getPluginSettingsFolder(id);
  const filePath = path.join(root, "settings.yml");
  await saveYml(settings, filePath);
}

/**
 * Saves the main settings of the application into the settings file.
 */
export async function setPluginDisabledSettings(id: string, disabled: boolean) {
  const data = await getPluginSettings(id);
  data.disabled = disabled;
  await setPluginSettings(id, data);
}
