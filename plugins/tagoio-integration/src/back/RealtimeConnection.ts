import os from "node:os";
import { URLSearchParams } from "node:url";
import { core, helpers, pluginStorage } from "@tago-io/tcore-sdk";
import EventSource from "eventsource";
import { cache } from "./Global.ts";
import { getMachineID } from "./Helpers.ts";
import { sendDataToTagoio } from "./Request.ts";
import removeNullValues from "../../../../packages/sdk/src/Types/Helpers/removeNullValues.ts";
import { IComputerUsage } from "@tago-io/tcore-sdk/types";

let events: EventSource | null = null;
const pingInterval = 240000;
/**
 * Eventsource used to communicate with the API.
 */

/**
 */
function startRealtimeCommunication(token: string) {
  if (!token || events) {
    return;
  }

  const channel = "commands";
  const params = new URLSearchParams({ token, channel });
  const url = `${process.env.TAGOIO_SSE}/events?${params.toString()}`;

  const connect = () => {
    events = new EventSource(url);
    let pingFunction: NodeJS.Timeout | undefined = undefined;

    events.onopen = async () => {
      const tcore = await pluginStorage.get("tcore").catch(() => null);
      cache.events = events;
      await emitStartData(token, tcore.id);
      pingFunction = setInterval(async () => {
        await emitStartData(token, tcore.id);
      }, pingInterval);
    };

    events.onmessage = async (event) => {
      const messageData = JSON.parse(event.data);
      const connID = messageData.channel.slice(9);
      switch (messageData.payload) {
        case "summary-computer-usage": {
          const data = await Promise.all([
            core.getSummary(),
            helpers.getComputerUsage(),
          ]);
          const response = await sendDataToTagoio(
            token,
            { summary: data[0], computer_usage: data[1] },
            connID,
            "summary-computer-usage-tcore",
          );
          if (response) {
            cache.serverIO?.emit(
              "event",
              "summary-computer-usage",
              "sse::summary-computer-usage",
              Date.now(),
              response,
            );
          }
          break;
        }
        case "disconnect":
          closeRealtimeConnection();
          break;
        default:
          console.error("Unknown event payload", messageData.payload);
      }
    };

    events.onerror = (error: any) => {
      console.error("EventSource encountered an error:", error);
      if (events) {
        closeRealtimeConnection();
        clearInterval(pingFunction);
      }
      setTimeout(connect, 5000);
    };
  };

  connect();
}

/**
 */
function closeRealtimeConnection() {
  events?.close();
  events = null;
  cache.events = null;
}

/**
 * Emits a ping event to the API.
 */
async function emitStartData(token: string, connID: string) {
  const systemStartTime = new Date(Date.now() - os.uptime() * 1000);
  const tcoreStartTime = new Date(Date.now() - process.uptime() * 1000);
  const osInfo = await helpers.getOSInfo();
  const data = await Promise.all([
    core.getSummary(),
    helpers.getComputerUsage(),
  ]);

  const computerUsage = removeNullValues(data[1]);
  const startData = {
    machine_id: getMachineID(),
    local_ips: getLocalIPs().join(", "),
    name: os.hostname(),
    os: osInfo,
    system_start_time: systemStartTime,
    tcore_start_time: tcoreStartTime,
    tcore_version: "0.7.0",
    summary: data[0],
    computer_usage: computerUsage,
    last_ping: Date.now(),
  };
  const response = await sendDataToTagoio(
    token,
    startData,
    connID,
    "update-tcore",
  );
  if (response) {
    const tcore = await sendDataToTagoio(
      token,
      { summary: true },
      connID,
      "get-tcore",
    );
    if (tcore) {
      await pluginStorage.set("tcore", tcore);
      cache.serverIO?.emit(
        "event",
        "connected",
        "sse::commands",
        Date.now(),
        tcore,
      );
    }
  }
}

/**
 * Get local IP addresses.
 */
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const tmp of interfaces[name] || []) {
      const { address, family, internal } = tmp;
      if (family === "IPv4" && !internal) {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

export { closeRealtimeConnection, startRealtimeCommunication };
