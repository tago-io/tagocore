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
        case "sse::action::schedule": {
          const schedule = await core.triggerActionScheduleCheck();
          const dataRetentions = await core.triggerDeviceDataRetentionCheck();
          const response = await sendDataToTagoio(token, { schedule, dataRetentions }, event.data.connID, "");
          console.info("Schedule sent", response);
          break;
        }
        case "sse::device::data::added": {
          const device = await core.getDeviceByToken(event.data.deviceToken);
          let result: any = null;
          if (device) {
            result = await core.addDeviceData(device.id, event.data.deviceData).catch(() => null);
          }
          const response = await sendDataToTagoio(token, result, event.data.connID, "");
          console.info("Data added", response);
          break;
        }
        case "sse::device::list": {
          event.data.query.fields = (event.data.query.fields || []).filter(
            (x: string) => x !== "bucket",
          );
          const list = await core.getDeviceList(event.data.query);
          const response = await sendDataToTagoio(token, list, event.data.connID, "");
          console.info("Device list sent", response);
          break;
        }
        case "sse::device::info": {
          const info = await core.getDeviceInfo(event.data.deviceID);
          const response = await sendDataToTagoio(token, info, event.data.connID, "");
          console.info("Device info sent", response);
          break;
        }
        case "sse::device::data": {
          const data = await core.getDeviceData(event.data.deviceID, event.data.query);
          const response = await sendDataToTagoio(token, data, event.data.connID, "");
          console.info("Device data sent", response);
          break;
        }
        case "sse::summary": {
          const summary = await core.getSummary();
          const response = await sendDataToTagoio(token, summary, event.data.connID, "");
          console.info("Summary sent", response);
          break;
        }
        case "sse::data::attach": {
          cache.attachedDevices.push(event.data.deviceID);
          break;
        }
        case "sse::data::unattach": {
          const i = cache.attachedDevices.indexOf(event.data.deviceID);
          if (i >= 0) {
            cache.attachedDevices.splice(i, 1);
          }
          break;
        }
        case "sse::summary-and-computer-usage": {
          const data = await Promise.all([
            core.getSummary(),
            helpers.getComputerUsage(),
          ]);
          const response = await sendDataToTagoio(token, { summary: data[0], computer_usage: data[1] }, event.data.connID, "");
          console.info("Summary and Computer Usage sent", response);
          break;
        }
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
