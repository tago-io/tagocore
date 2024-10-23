
import { HookModule, NavbarButtonModule, PageModule, pluginStorage, SystemModule } from "@tago-io/tcore-sdk";
import { cache } from "./Global.ts";
import { logError } from "./Log.ts";
import { closeServer, initServer } from "./Server.ts";
import { initSocket } from "./Socket.ts";

let started = false;

/**
 */
async function cleanUpOldStructure() {
  await pluginStorage.delete("tcore-token");
  await pluginStorage.delete("tcore-profile-token");
  await pluginStorage.delete("tcore-id");
}

/**
 */
async function init() {
  if (started) {
    return;
  }
  initServer();

  if (process.env.TCORE_CLUSTER_TOKEN) {
    // cluster start
    try {
      started = true;
      await initSocket(process.env.TCORE_CLUSTER_TOKEN);
    } catch (ex) {
      logError("These are the possible causes for the disconnect:");
      logError(" • Invalid TagoCore Cluster token");
      logError(" • No connection to TagoIO servers");
      logError(
        " • You exceeded the maximum amount of TagoCore instances in your TagoIO Profile",
      );
      logError("Verify all these possible issues and try again.");
      await new Promise((resolve) => setTimeout(resolve, 200));
      await cache.systemModule?.exit?.(0);
    }
  } else {
    // non-cluster start
    await cleanUpOldStructure().catch(() => null);

    const normalToken = await pluginStorage.get("token").catch(() => null);
    if (normalToken) {
      await initSocket(normalToken);
    }
  }
}

/**
 */
async function onPluginDestroy() {
  closeServer();
  started = false;
}

/**
 */
function onInstallStorePlugin(id: string, version: string, platform: any) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "install";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", {
      type,
      data: { platform, id, version },
    });
  });
  return promise;
}

/**
 */
function onUninstallStorePlugin(id: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "uninstall";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { id } });
  });
  return promise;
}

/**
 */
function onEditModuleSettings(id: string, settings: any) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "settings";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { id, settings } });
  });
  return promise;
}

/**
 */
function onDisablePlugin(id: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "disable";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { id } });
  });
  return promise;
}

/**
 */
function onEnablePlugin(id: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "enable";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { id } });
  });
  return promise;
}

/**
 */
function onStartPluginModule(pluginID: string, moduleID: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "startModule";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", {
      type,
      data: { pluginID, moduleID },
    });
  });
  return promise;
}

/**
 */
function onStopPluginModule(pluginID: string, moduleID: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "stopModule";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", {
      type,
      data: { pluginID, moduleID },
    });
  });
  return promise;
}

/**
 */
function onSetMasterPassword(password: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "setMasterPassword";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { password } });
  });
  return promise;
}

/**
 */
function onSetDatabasePlugin(databasePlugin: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "setDatabasePlugin";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", {
      type,
      data: { databasePlugin },
    });
  });
  return promise;
}

/**
 */
function onFactoryReset(password: string) {
  const promise = new Promise<void>((resolve, reject) => {
    const type = "factoryReset";
    cache.commandsQueue.push({ type, promise: { resolve, reject } });
    cache.socket?.emit("tcore::message:add", { type, data: { password } });
  });
  return promise;
}

/*
 * Hook module to listen to data events and then send
 * the data to the server's realtime.
 */
const hookModule = new HookModule({
  id: "hook",
  name: "Events listener",
});

hookModule.onMainDatabaseModuleLoaded = init;

hookModule.onAfterInsertDeviceData = async (deviceID, data) => {
  if (cache.attachedDevices.includes(deviceID)) {
    const event = "tcore::device::data::add";
    cache.serverIO?.emit("event", "send", event, Date.now(), data);
    cache.socket?.emit(event, deviceID, data);
  }
};

/**
 * Main .html page
 */
new PageModule({
  id: "main-page",
  route: "/tagoio-integration",
  assets: "./build/front",
  name: "Main page",
});

/**
 * Assets (.js, .css) and other routes
 */
const assetsPage = new PageModule({
  id: "other",
  route: "/tagoio-integration/*",
  assets: "./build/front",
  name: "Details page",
});

if (process.env.TCORE_CLUSTER_TOKEN) {
  const systemModule: any = new SystemModule({ id: "system" });
  systemModule.onLoad = init;
  systemModule.onDestroy = onPluginDestroy;
  systemModule.onInstallStorePlugin = onInstallStorePlugin;
  systemModule.onUninstallStorePlugin = onUninstallStorePlugin;
  systemModule.onEditModuleSettings = onEditModuleSettings;
  systemModule.onDisablePlugin = onDisablePlugin;
  systemModule.onEnablePlugin = onEnablePlugin;
  systemModule.onStartPluginModule = onStartPluginModule;
  systemModule.onStopPluginModule = onStopPluginModule;
  systemModule.onSetMasterPassword = onSetMasterPassword;
  systemModule.onSetDatabasePlugin = onSetDatabasePlugin;
  systemModule.onFactoryReset = onFactoryReset;
  cache.systemModule = systemModule;
} else {
  assetsPage.onLoad = init;
  assetsPage.onDestroy = onPluginDestroy;
}

new NavbarButtonModule({
  id: "navbar-button",
  name: "Integration button",
  option: {
    icon: "io",
    action: {
      type: "open-url",
      url: "/tagoio-integration",
    },
  },
});
