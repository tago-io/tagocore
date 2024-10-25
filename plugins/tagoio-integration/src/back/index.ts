
import { HookModule, NavbarButtonModule, PageModule, pluginStorage, SystemModule } from "@tago-io/tcore-sdk";
import { cache } from "./Global.ts";
import { logError } from "./Log.ts";
import { closeServer, initServer } from "./Server.ts";
import { startRealtimeCommunication } from "./RealtimeConnection.ts";
import { sendDataToTagoio } from "./Request.ts";

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

  await cleanUpOldStructure().catch(() => null);

  const normalToken = await pluginStorage.get("token").catch(() => null);
  if (normalToken) {
    await startRealtimeCommunication(normalToken);
  }
}

/**
 */
async function onPluginDestroy() {
  closeServer();
  started = false;
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
    // const event = "tcore::device::data::add";
    // cache.serverIO?.emit("event", "send", event, Date.now(), data);
    // cache.socket?.emit(event, deviceID, data);
    sendDataToTagoio(await pluginStorage.get("token"), data, deviceID, "device-data").catch(logError);
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

assetsPage.onLoad = init;
assetsPage.onDestroy = onPluginDestroy;

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
