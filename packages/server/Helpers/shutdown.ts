/* eslint-disable no-async-promise-executor */
import type { Server } from "node:http";
import { getSystemName } from "@tago-io/tcore-shared";
import { stopActionScheduleTimer } from "../Services/ActionScheduler.ts";
import { terminateAllPlugins } from "../Services/Plugins.ts";
import { log } from "./log.ts";

let shutdownTries = 0;

/**
 * Shuts down the server, all plugins, and then the application.
 */
export async function shutdown(httpServer: Server) {
  stopActionScheduleTimer();

  log("api", `Shutting down ${getSystemName()} (${shutdownTries + 1}/3 tries)`);

  // increase the shutdown tries
  shutdownTries += 1;

  // first we close the server before closing any plugins
  httpServer.close();

  if (shutdownTries >= 3) {
    // forcefully exit
    log("api", "Terminated with exit code 1");
    process.exit(1);
  }

  await terminateAllPlugins(false);

  log("api", "Terminated with exit code 0");
  process.exit(0);
}
