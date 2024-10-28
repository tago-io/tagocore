import os from "node:os";
import { URLSearchParams } from "node:url";
import { core, helpers } from "@tago-io/tcore-sdk";
import { cache } from "./Global.ts";
import { getMachineID } from "./Helpers.ts";
import EventSource from "eventsource";
import { sendDataToTagoio } from "./Request.ts";

/**
 * Eventsource used to communicate with the API.
 */
let events: EventSource | null = null;

/**
 */
function startRealtimeCommunication(token: string) {
  if (!token || events) {
    return;
  }

  const channel = "commands";
  const params = new URLSearchParams({ token, channel });
  const url = `https://sse.tago.io/events?${params.toString()}`;

  const connect = () => {
    events = new EventSource(url);

    events.onmessage = async (event) => {
      console.log("Received event", event);
      switch (event.data.channel) {
        case "sse::commands":
          console.info("Connected to TagoIO");
          emitStartData(token, event.data.connID);
          break;
        case "sse::instance":
          cache.tcore = event.data.tcore;
          break;
        case "sse::summary": {
          const summary = await core.getSummary();
          const response = await sendDataToTagoio(token, summary, event.data.connID, "update-summary-tcore");
          console.info("Summary sent", response);
          break;
        }
        case "sse::summary-and-computer-usage": {
          const data = await Promise.all([
            core.getSummary(),
            helpers.getComputerUsage(),
          ]);
          const response = await sendDataToTagoio(token, { summary: data[0], computer_usage: data[1] }, event.data.connID, "summary-computer-usage-tcore");
          console.info("Summary and Computer Usage sent", response);
          break;
        }
        case "sse::disconnect":
          events?.close();
          break;
        default:
          console.error("Unknown event channel", event.data.channel);
      }

    };

    events.onerror = (error: any) => {
      console.error("EventSource encountered an error:", error);
      if (events) {
        events.close();
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
}

/**
 * Emits a ping event to the API.
 */
async function emitStartData(token: string, connID: string) {
  const systemStartTime = new Date(Date.now() - os.uptime() * 1000);
  const tcoreStartTime = new Date(Date.now() - process.uptime() * 1000);
  const osInfo = await helpers.getOSInfo();
  const startData = {
    machine_id: getMachineID(),
    local_ips: getLocalIPs().join(", "),
    name: os.hostname(),
    os: osInfo,
    system_start_time: systemStartTime,
    tcore_start_time: tcoreStartTime,
    tcore_version: "0.7.0",
  };

  const response = await sendDataToTagoio(token, startData, connID, "update-tcore");
  console.info("Start data sent", response);
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
