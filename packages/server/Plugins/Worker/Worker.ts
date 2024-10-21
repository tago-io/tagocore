import EventEmitter from "node:events";
import fs from "node:fs";
/* eslint-disable no-unused-vars */
import path from "node:path";
import { Worker as WorkerThread } from "node:worker_threads";
import type { IModuleSetup, IPluginMessage } from "@tago-io/tcore-sdk/types";
import { nanoid } from "nanoid";
import { log, logError } from "../../Helpers/log.ts";
import {
  getActionList,
  invokeActionOnTriggerChange,
} from "../../Services/Action.ts";
import { getPluginSettings } from "../../Services/Settings.ts";
import Module from "../Module/Module.ts";
import type Plugin from "../Plugin/Plugin.ts";
import executePluginRequest from "../executePluginRequest.ts";

/**
 * Keeps track of the messages sent to plugins to use the reject/resolve
 * function and return the result to the same promise.
 */
const callbacks = new Map<string, any>();

/**
 * Controls the communication between the plugin, modules, and the API.
 * The whole lifecycle of the plugin is in here.
 */
class Worker extends EventEmitter {
  /**
   * Inner worker object. This is the thread that actually runs the plugin
   * code.
   */
  private worker?: WorkerThread;
  private startRejectTimeout?: ReturnType<typeof setTimeout>;
  private moduleLoadTimeout?: ReturnType<typeof setTimeout>;

  constructor(public plugin: Plugin) {
    super();
  }

  /**
   */
  public start() {
    if (this.worker) {
      throw new Error("Plugin already running");
    }

    const fileName = this.plugin.package.main || "index.js";
    const filePath = path.join(this.plugin.folder, fileName);
    const exists = fs.existsSync(filePath);
    if (!exists) {
      throw new Error(`File "${filePath}" doesn't exist`);
    }

    this.worker = new WorkerThread(filePath, { stdout: true, stderr: true });
    this.worker.on("error", this.onError.bind(this));
    this.worker.on("exit", this.onExit.bind(this));
    this.worker.on("message", this.onWorkerMessage.bind(this));
    this.worker.stdout.on("data", this.onWorkerStdout.bind(this));
    this.worker.stderr.on("data", this.onWorkerStderr.bind(this));

    this.startRejectTimeout = setTimeout(() => {
      this.onError(new Error("Took too long to load (30s)"));
    }, 30 * 1000);
  }

  /**
   * Terminates the worker instance.
   */
  public stop() {
    for (const [key, value] of callbacks.entries()) {
      if (value.plugin === this.plugin) {
        const err = new Error("Unexpected Plugin shutdown");
        callbacks?.get(key).reject?.(err);
        callbacks.delete(key);
      }
    }

    this.removeAllListeners();
    this.worker?.removeAllListeners();
    this.worker?.stderr?.removeAllListeners();
    this.worker?.stdout?.removeAllListeners();
    this.worker?.terminate();
    this.worker = undefined;
  }

  /**
   */
  public invoke(moduleID: string, method: string, ...args: any[]) {
    return new Promise((resolve, reject) => {
      const connectionID = nanoid(10);

      callbacks.set(connectionID, {
        resolve,
        reject,
        plugin: this.plugin,
        method,
        time: Date.now(),
      });

      this.worker?.postMessage({
        connectionID,
        event: "executePluginMethod",
        method,
        params: [args].flat(),
        setupID: moduleID,
      });
    });
  }

  /**
   */
  private onExit(code: number) {
    const error = new Error(`Plugin forced exit with status ${code || 0}`);
    this.onError(error);
  }

  /**
   */
  private onError(ex: Error) {
    if (this.startRejectTimeout) {
      clearTimeout(this.startRejectTimeout);
    }
    this.emit("uncaughtException", ex);
    this.plugin.error = ex?.message || String(ex);
    log(`plugin:${this.plugin.id}`, ex.stack || ex.message || String(ex));
    this.plugin.stop(true);
  }

  /**
   */
  private onWorkerStdout(buffer: Buffer) {
    log(`plugin:${this.plugin.id}`, buffer.toString());
  }

  /**
   */
  private onWorkerStderr(buffer: Buffer) {
    logError(`plugin:${this.plugin.id}`, buffer.toString());
  }

  /**
   */
  private onWorkerMessage(message: IPluginMessage) {
    if (message.event === "init") {
      this.onModuleInit(message.params);
    } else if (message.event === "executeApiMethod") {
      this.onWorkerExecuteApiMethod(message);
    } else if (message.event === "pluginMethodResponse") {
      this.onWorkerResponse(message);
    }
  }

  /**
   * @event
   */
  private async onModuleInit(setup: IModuleSetup) {
    const module = new Module(this.plugin, setup);
    this.plugin.modules.set(module.id, module);

    const settings = await getPluginSettings(this.plugin.id);
    const moduleSettings = settings?.modules?.find((x) => x.id === setup.id);
    if (moduleSettings?.disabled) {
      module.state = "stopped";
    } else {
      await module.start().catch(() => null);
    }

    this.onModuleLoaded();

    // TODO improve
    if (setup.type === "action-trigger") {
      const actions = await getActionList({
        amount: 99899,
        fields: ["type", "trigger"],
      }).catch(() => null);
      const filtered = actions?.filter(
        (x) => x.type === `${this.plugin.id}:${setup.id}`,
      );
      for (const item of filtered || []) {
        invokeActionOnTriggerChange(item.id, item.type as string, item.trigger);
      }
    }
  }

  /**
   */
  private onModuleLoaded() {
    if (this.moduleLoadTimeout) {
      clearTimeout(this.moduleLoadTimeout);
    }

    this.moduleLoadTimeout = setTimeout(() => {
      const mods = [...this.plugin.modules.values()];
      const done = mods.every((x) => ["started", "stopped"].includes(x.state));
      if (done) {
        // all modules are either done, or stopped (error),
        // this means that this worker has successfully started
        this.emit("start");

        if (this.moduleLoadTimeout) {
          // clear the timeout that stops loading modules
          clearTimeout(this.moduleLoadTimeout);
        }

        if (this.startRejectTimeout) {
          // clears the timeout that rejects plugins if they take too long
          clearTimeout(this.startRejectTimeout);
        }
      }
    }, 250);
  }

  /**
   */
  private onWorkerResponse(message: IPluginMessage) {
    const callback = callbacks.get(message.connectionID);
    if (callback) {
      if (message.error) {
        callback?.reject(message.error);
      } else {
        callback?.resolve(message.params);
      }
      callbacks.delete(message.connectionID);
    }
  }

  /**
   */
  private async onWorkerExecuteApiMethod(message: IPluginMessage) {
    const { method, connectionID } = message;
    try {
      const args = [message.params].flat();
      const params = await executePluginRequest(
        this.plugin.id,
        method,
        ...args,
      );
      this.worker?.postMessage({
        event: "apiMethodResponse",
        connectionID,
        method,
        params,
      });
    } catch (error) {
      this.worker?.postMessage({
        event: "apiMethodResponse",
        connectionID,
        method,
        error,
      });
    }
  }
}

/**
 * Starts the interval to erase old callbacks that were unanswered.
 */
export function startCallbackInterval() {
  const maximumTime = 60 * 1000; // 1 min without response
  const checkTime = 10 * 1000; // check every 10 seconds

  callbackInterval = setInterval(() => {
    for (const [key, value] of callbacks.entries()) {
      if (Date.now() - value.time >= maximumTime) {
        const message = `Response timed out (60s) for method "${value.method}"`;
        callbacks.get(key)?.reject(message);
        callbacks.delete(key);
        logError("api", `Plugin "${value.plugin.tcoreName}" - ${message}.`);
      }
    }
  }, checkTime);
}

let callbackInterval: ReturnType<typeof setInterval> | null = null;

export { callbackInterval };
export default Worker;
