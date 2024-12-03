import {
  HookModule,
  NavbarButtonModule,
  PageModule,
  SystemModule,
  pluginStorage,
} from "@tago-io/tcore-sdk";
import { startRealtimeCommunication } from "./RealtimeConnection.ts";
import { closeServer, initServer } from "./Server.ts";

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
