import { parentPort } from "node:worker_threads";
import { nanoid } from "nanoid";
import type { IPluginMessage } from "../../Types.ts";

/**
 * A single callback waiting to be triggered from one of the API responses.
 */
interface ICallback {
  resolve: (...args: any[]) => void;
  reject: (...args: any[]) => void;
  method: string;
  time: number;
}

/**
 * This class provides methods to communicate with the API (outside of the worker environment).
 */
class APIBridge {
  private callbacks = new Map<string, ICallback>();

  constructor() {
    this.onAPIMessage = this.onAPIMessage.bind(this);
    this.attachEvents();
  }

  /**
   * Attaches the events to listen to message from the API.
   */
  private attachEvents() {
    parentPort?.on("message", this.onAPIMessage);
  }

  /**
   */
  private destroy() {
    parentPort?.removeListener("message", this.onAPIMessage);
  }

  /**
   * Called when a message arrives from the API.
   */
  private onAPIMessage(message: IPluginMessage) {
    if (message.event === "apiMethodResponse") {
      if (this.callbacks.has(message.connectionID)) {
        const { error } = message;
        if (error) {
          // there was an error while executing a method in the plugin, we must reject the callback.
          this.callbacks.get(message.connectionID)?.reject(error);
        } else {
          // no errors during the method execution in the plugin. We must resolve the callback.
          this.callbacks.get(message.connectionID)?.resolve(message.params);
        }

        // remove the callback
        this.callbacks.delete(message.connectionID);
      }
    }
  }

  /**
   * Invokes a method from one of the services of the API.
   */
  protected invokeApiMethod(method: string, ...args: any[]): any {
    return new Promise((resolve, reject) => {
      const connectionID = nanoid(10);

      this.callbacks.set(connectionID, {
        resolve,
        reject,
        method,
        time: Date.now(),
      });

      parentPort?.postMessage({
        connectionID,
        event: "executeApiMethod",
        method,
        params: args,
      });
    });
  }
}

export default APIBridge;
