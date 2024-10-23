import os from "node:os";
import { core, helpers, pluginStorage } from "@tago-io/tcore-sdk";
import type {
  IDeviceDataQuery,
  IDeviceListQuery,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import chalk from "chalk";
import { type Socket, io } from "socket.io-client";
import { handleClusterState } from "./Cluster.ts";
import { cache } from "./Global.ts";
import { getMachineID } from "./Helpers.ts";

/**
 * Socket used to communicate with the API.
 */
let socket: Socket | null;

if (!process.env.TCORE_CLUSTER_TOKEN) {
  setInterval(
    async () => {
      const token = await pluginStorage.get("token").catch(() => null);
      if (token && socket && socket?.disconnected) {
        const tokenEnd = token.substring(token.length - 5);
        console.log(
          "Trying to reconnect using token ending in",
          chalk.yellow(tokenEnd),
        );
        socket?.connect();
      }
    },
    1000 * 60 * 5,
  );
}

/**
 */
function initSocket(token: string) {
  if (!token || socket) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    console.log("Connecting...");

    const query = { token };
    let connectErrors = 0;

    socket = io(process.env.TAGOIO_REALTIME || "", {
      transports: ["websocket"],
      query,
    });
    socket.connect();

    cache.socket = socket;

    /**
     */
    socket.on("ready", () => {
      connectErrors = 0;
      console.log("Connected to TagoIO");
      emitStartData();
      cache.serverIO?.emit("status", cache.socket?.connected);
    });

    /**
     */
    socket.on("disconnect", () => {
      console.log(chalk.redBright("[ERROR]"), "Unexpected disconnection");
      cache.serverIO?.emit("status", cache.socket?.connected);
      cache.attachedDevices = [];

      if (process.env.TCORE_CLUSTER_TOKEN) {
        // if the promise is still active the reject will make sure that
        // the other side receives an error and cancels the execution flow
        reject();
      } else {
        // if the tcore was deleted without this instance logging out we need
        // to resolve the connection normally for the user to try again
        resolve();
      }
    });

    /**
     */
    socket.on("connect_error", () => {
      connectErrors += 1;
      console.log(
        chalk.redBright("[ERROR]"),
        `Connect error (${connectErrors}/3).`,
      );

      cache.serverIO?.emit("status", cache.socket?.connected);
      cache.attachedDevices = [];

      if (connectErrors >= 3 || !process.env.TCORE_CLUSTER_TOKEN) {
        connectErrors = 0;
        socket?.disconnect();
        reject();
      }
    });

    /**
     */
    socket.on("tcore::instance", (tcore) => {
      cache.tcore = tcore;
      if (!process.env.TCORE_CLUSTER_TOKEN) {
        resolve();
      }
    });

    /**
     */
    socket.on("tcore::action::schedule", (connID: string) => {
      call("tcore::action::schedule", connID, async () => {
        await core.triggerActionScheduleCheck();
        await core.triggerDeviceDataRetentionCheck();
      });
    });

    /**
     */
    socket.on("tcore::cluster::busy", (connID: string) => {
      call("tcore::cluster::busy", connID, async () => {
        const message =
          "Cluster is busy executing another action. Try again later.";
        cache.commandsQueue.forEach((x) => x.promise.reject(message));
        cache.commandsQueue = [];
      });
    });

    /**
     */
    socket.on("tcore::cluster::state", async (connID, state, options) => {
      if (cache.stateQueue.length > 0) {
        // already has a state in the queue, add to the queue and wait
        cache.stateQueue.push({ connID, state, options });
      } else {
        // no state in queue, run it right now
        cache.stateQueue.push({ connID, state, options });
        await checkStateQueue();
        resolve();
      }
    });

    /**
     */
    socket.on(
      "tcore::device::data::added",
      async (connID, deviceToken, data) => {
        call("tcore::device::data::added", connID, async () => {
          const device = await core.getDeviceByToken(deviceToken);
          if (device) {
            await core.addDeviceData(device.id, data).catch(() => null);
          }
        });
      },
    );

    /**
     * Called when the realtime server requests a device list on this instance.
     */
    socket.on(
      "tcore::device::list",
      async (connID, query: IDeviceListQuery) => {
        call("tcore::device::list", connID, async () => {
          query.fields = (query.fields || []).filter(
            (x: string) => x !== "bucket",
          );
          const list = await core.getDeviceList(query);
          return list;
        });
      },
    );

    /**
     * Called when the realtime server requests a device info on this instance.
     */
    socket.on("tcore::device::info", async (connID, deviceID: TGenericID) => {
      call("tcore::device::info", connID, async () => {
        const info = await core.getDeviceInfo(deviceID);
        return info;
      });
    });

    /**
     * Called when the realtime server requests data from this instance.
     */
    socket.on(
      "tcore::device::data",
      async (connID, deviceID: TGenericID, query: IDeviceDataQuery) => {
        call("tcore::device::data", connID, async () => {
          const data = await core.getDeviceData(deviceID, query);
          return data;
        });
      },
    );

    /**
     */
    socket.on("tcore::summary", async (connID) => {
      call("tcore::summary", connID, () => core.getSummary());
    });

    /**
     * Called when someone enters a dashboard with this device in a widget.
     */
    socket.on("tcore::data::attach", async (deviceID) => {
      cache.attachedDevices.push(deviceID);
    });

    /**
     * Called when someone leaves a dashboard with this device in a widget.
     */
    socket.on("tcore::data::unattach", async (deviceID) => {
      const i = cache.attachedDevices.indexOf(deviceID);
      if (i >= 0) {
        cache.attachedDevices.splice(i, 1);
      }
    });

    /**
     */
    socket.on("tcore::summary-and-computer-usage", async (connID) => {
      call("tcore::summary-and-computer-usage", connID, async () => {
        const data = await Promise.all([
          core.getSummary(),
          helpers.getComputerUsage(),
        ]);
        return { summary: data[0], computer_usage: data[1] };
      });
    });
  });
}

/**
 */
function closeSocket() {
  socket?.off();
  socket?.disconnect?.();
  socket = null;
}

/**
 * Calls a procedure.
 */
async function call(event: string, connID: string, fn: Function) {
  try {
    console.log(`• Received ${chalk.cyanBright(event)} event`);
    const promise = fn();
    const result = await promise;
    cache.serverIO?.emit("event", "receive", event, Date.now(), result);
    socket?.emit("tcore::response::success", connID, result);
    console.log("└─", chalk.green("[DONE]"), "Handled event");
  } catch (ex: any) {
    const err = ex?.message || ex;
    console.log("└─", chalk.redBright("[ERROR]"), err);
    socket?.emit("tcore::response::error", connID, err);
  }
}

/**
 * Emits a ping event to the API.
 */
async function emitStartData() {
  const systemStartTime = new Date(Date.now() - os.uptime() * 1000);
  const tcoreStartTime = new Date(Date.now() - process.uptime() * 1000);
  const osInfo = await helpers.getOSInfo();

  socket?.emit("tcore::start", {
    machine_id: getMachineID(),
    local_ips: getLocalIPs().join(", "),
    name: os.hostname(),
    os: osInfo,
    system_start_time: systemStartTime,
    tcore_start_time: tcoreStartTime,
    tcore_version: "0.7.0",
  });
}

/**
 * TODO
 */
async function checkStateQueue() {
  for (const item of cache.stateQueue) {
    const isRollback = item.options?.rollback;
    const error = item.options?.error;
    const event = `tcore::cluster::state${isRollback ? "::rollback" : ""}`;

    if (isRollback) {
      const message = `Rolling back due to error in one of the Cluster instances: ${error}`;
      cache.systemModule?.emitInstallLog({ error: true, message });
    }

    await call(event, item.connID, async () => {
      if (isRollback) {
        console.log(
          "├─",
          chalk.cyanBright("[ROLLBACK]"),
          "due to error",
          chalk.redBright(error),
        );
      }
      await handleClusterState(item.state);
    });
  }

  cache.stateQueue = [];
}

/**
 * TODO
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

/**
 * TODO
 */
function isConnectedToAPI() {
  return true;
}

export { closeSocket, initSocket, isConnectedToAPI };
