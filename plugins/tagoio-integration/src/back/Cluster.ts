import { core } from "@tago-io/tcore-sdk";
import chalk from "chalk";
import { cache } from "./Global.ts";

const red = chalk.redBright;
const green = chalk.green;
const yellow = chalk.yellow;

/**
 */
async function downloadPlugin(id: string, version: string, platform: string) {
  const source = `https://plugins.tagocore.com/${id}/${version}/download/${platform}`;
  const start = id !== "4fb07d6c56d8f67e504dcbcf38ddc15f";
  await core.installPlugin(source, { start });
}

/**
 */
async function handlePluginInstall(serverPlugin: any, trimmedID: string) {
  const { id, version, platform } = serverPlugin;

  const localPlugins = await core.getPluginList();
  const localPlugin = localPlugins.find((x) => x.id === id);
  if (!localPlugin) {
    branch("Installing plugin", yellow(trimmedID), yellow(`v${version}`));
    await downloadPlugin(id, version, platform);
    return true;
  }
  if (localPlugin.version !== version) {
    branch("Installing plugin", yellow(trimmedID), yellow(`v${version}`));
    await downloadPlugin(id, version, platform);
    return true;
  }
}

function JSONstringifyInOrder(obj: any) {
  const allKeys = new Set();
  JSON.stringify(obj, (key, value) => (allKeys.add(key), value));
  return JSON.stringify(obj, Array.from(allKeys).sort() as string[]);
}

/**
 */
async function handlePluginSettings(serverPlugin: any, trimmedID: string) {
  const serverModules = serverPlugin.modules || [];
  const actions: any = {};
  let logged = false;

  const localPluginSettings = await core.getPluginSettings(serverPlugin.id);

  for (const serverModule of serverModules) {
    const moduleID = serverModule.id;
    const moduleInfo = await core.getPluginModuleInfo(
      serverPlugin.id,
      moduleID,
    );
    const moduleSettings = localPluginSettings.modules?.find(
      (x: any) => x.id === moduleID,
    );
    const settingsDiffer =
      JSONstringifyInOrder(moduleSettings) !==
      JSONstringifyInOrder(serverModule);
    if (settingsDiffer) {
      if (!logged) {
        logged = true;
        if (moduleSettings) {
          branch("Changed settings for plugin", yellow(trimmedID));
        } else {
          branch("Added settings for plugin", yellow(trimmedID));
        }
      }

      if (serverModule.disabled) {
        if (moduleInfo?.state === "started") {
          actions[moduleID] = "stop";
        }
      } else {
        actions[moduleID] = "restart";
      }
    } else {
      if (
        !serverPlugin.disabled &&
        moduleInfo?.error &&
        !serverModule.disabled
      ) {
        actions[moduleID] = "start";
      }
    }
  }

  await core.setPluginSettings(serverPlugin.id, {
    disabled: localPluginSettings.disabled,
    modules: serverPlugin.modules,
  });

  for (const moduleID in actions) {
    if (actions[moduleID] === "start") {
      branch(
        green("Started"),
        "plugin module",
        yellow(trimmedID),
        "-",
        yellow(moduleID),
      );
      await core.startPluginModule(serverPlugin.id, moduleID);
    } else if (actions[moduleID] === "restart") {
      branch(
        green("Restarted"),
        "plugin module",
        yellow(trimmedID),
        "-",
        yellow(moduleID),
      );
      await core.startPluginModule(serverPlugin.id, moduleID);
    } else if (actions[moduleID] === "stop") {
      branch(
        red("Stopped"),
        "plugin module",
        yellow(trimmedID),
        "-",
        yellow(moduleID),
      );
      await core.stopPluginModule(serverPlugin.id, moduleID).catch(() => null);
    }
  }
}

/**
 */
async function handlePluginDisabled(serverPlugin: any, trimmedID: string) {
  const settings = await core.getPluginSettings(serverPlugin.id);

  const serverDisabled = !!serverPlugin.disabled;
  const localDisabled = !!settings.disabled;

  if (serverDisabled !== localDisabled) {
    if (serverPlugin.disabled) {
      branch("Disabled plugin", yellow(trimmedID));
      await core.disablePlugin(serverPlugin.id).catch(() => null);
    } else {
      branch("Enabled plugin", yellow(trimmedID));
      await core.enablePlugin(serverPlugin.id).catch(() => null);
    }
  }
}

/**
 */
async function handleClusterState(clusterState: any) {
  let reboot = false;

  try {
    const statePlugins: any[] = clusterState?.plugins || [];

    if (clusterState === null || clusterState === undefined) {
      await core.doFactoryReset();
    }

    if (clusterState?.masterPassword) {
      await core.setMasterPassword(clusterState.masterPassword);
    }

    if (clusterState?.databasePlugin) {
      const settings = await core.getMainSettings();
      await core.setMainSettings({
        ...settings,
        database_plugin: clusterState.databasePlugin,
      });
    }

    for (const serverPlugin of statePlugins) {
      const trimmedID = serverPlugin.id.substring(serverPlugin.id.length - 5);
      await handlePluginSettings(serverPlugin, trimmedID);
      const installed = await handlePluginInstall(serverPlugin, trimmedID);
      await handlePluginDisabled(serverPlugin, trimmedID);

      if (installed && serverPlugin.id === "4fb07d6c56d8f67e504dcbcf38ddc15f") {
        // this plugin id
        reboot = true;
      }
    }

    const localPlugins = await core.getPluginList();
    for (const localPlugin of localPlugins) {
      // SQLITE, TAGOIO INTEGRATION, PLUGIN STORE are built-ins
      if (
        [
          "0810916b6ca256fb25afbe19b4f83b23",
          "2e8e52b993bcfbb495f0e4b51f687d89",
          "4fb07d6c56d8f67e504dcbcf38ddc15f",
          "c311dfe85cf1a29fb1d86a1a2c5afc1c",
        ].includes(localPlugin.id)
      ) {
        continue;
      }

      const trimmedID = localPlugin.id.substring(localPlugin.id.length - 5);
      const existsInState = statePlugins.some((x) => x.id === localPlugin.id);
      if (!existsInState) {
        await core.uninstallPlugin(localPlugin.id);
        branch("Removed plugin", yellow(trimmedID));
      }
    }

    cache.commandsQueue.forEach((x) => x.promise.resolve());
  } catch (ex: any) {
    const err = ex?.message || ex?.toString?.() || ex;
    cache.commandsQueue.forEach((x) => x.promise.reject(err));
    throw ex;
  } finally {
    cache.commandsQueue = [];
    if (reboot) {
      setTimeout(() => {
        console.log(
          "New TagoIO Integration version detected. Shutting Down cluster instance.",
        );
        cache.systemModule?.exit?.(0);
      }, 1000);
    }
  }
}

/**
 */
function branch(...args: any[]) {
  console.log("├─", ...args);
}

export { handleClusterState };
