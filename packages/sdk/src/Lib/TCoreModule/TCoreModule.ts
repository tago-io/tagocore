import { parentPort } from "node:worker_threads";
import type {
  IModuleMessageOptions,
  IModuleSetupWithoutType,
  IPluginMessage,
  TModuleMessageType,
  TPluginType,
} from "../../Types.ts";
import APIBridge from "../APIBridge/APIBridge.ts";

const moduleIDs = new Map<string, boolean>();

parentPort?.setMaxListeners(100);

/**
 * This is the base module for all modules.
 * It contains the communication between the API and this worker.
 */
abstract class TCoreModule<IConfigValues = any> {
  private started = false;

  constructor(
    protected setup: IModuleSetupWithoutType,
    protected type: TPluginType,
  ) {
    this.attachEvents();
    this.validateSetupID();

    // sends the init event to the API
    const params = { ...this.setup, type: this.type };
    parentPort?.postMessage({ event: "init", params });
  }

  /**
   * Shows a message in the module's configuration page.
   */
  public async showMessage(
    type: TModuleMessageType,
    message: string,
  ): Promise<void> {
    if (type === "info") {
      const color = "hsl(208, 96%, 75%, 0.2)";
      const iconColor = "hsl(208, 96%, 35%, 1)";
      const icon = "exclamation-circle";
      await this.showCustomMessage({ message, icon, iconColor, color });
    } else if (type === "error") {
      const color = "hsla(0, 100%, 44%, 0.1)";
      const iconColor = "hsl(0, 100%, 40%)";
      const icon = "exclamation-triangle";
      await this.showCustomMessage({ message, icon, iconColor, color });
    } else if (type === "warning") {
      const color = "hsla(44, 100%, 50%, 0.2)";
      const iconColor = "hsl(44, 100%, 21%)";
      const icon = "exclamation-triangle";
      await this.showCustomMessage({ message, icon, iconColor, color });
    }
  }

  /**
   * Shows a custom message in the module's configuration page.
   */
  public async showCustomMessage(args?: IModuleMessageOptions): Promise<void> {
    const bridge = new APIBridge();
    try {
      await (bridge as any).invokeApiMethod("showMessage", this.setup.id, args);
    } finally {
      (bridge as any).destroy();
    }
  }

  /**
   * Hides the custom message in the module's configuration page.
   */
  public async hideMessage(): Promise<void> {
    const bridge = new APIBridge();
    try {
      await (bridge as any).invokeApiMethod("hideMessage", this.setup.id);
    } finally {
      (bridge as any).destroy();
    }
  }

  /**
   */
  public async onLoad(configValues: IConfigValues): Promise<void> {
    // can be overridden
  }

  /**
   */
  public async onDestroy(): Promise<void> {
    // can be overridden
  }

  /**
   * Starts or restarts the current plugin.
   * This may be called more than once if the user decides to change the settings of the plugin.
   */
  protected async start(configValues: IConfigValues) {
    if (this.started) {
      // already started, let's clean up first
      await this.onDestroy();
    }

    await this.onLoad(configValues);

    if (!this.started) {
      // module has fully loaded for the first time
      const params = { id: this.setup.id };
      parentPort?.postMessage({ event: "firstLoad", params });
    }

    this.started = true;
  }

  /**
   * Stops this plugin and then sends a message notifying the API.
   *
   * This function is called by the API.
   */
  protected async stop() {
    await this.onDestroy();
    this.started = false;
  }

  /**
   * Attaches the events to listen to messages from the API.
   */
  private attachEvents() {
    parentPort?.on("message", this.onAPIMessage.bind(this));
  }

  /**
   * Called when a message arrives from the API.
   * @event
   */
  private onAPIMessage(message: IPluginMessage) {
    const { method, event, setupID, params, connectionID } = message;

    if (setupID && setupID !== this.setup.id) {
      // this message is not for this plugin module, ignore it.
      return;
    }

    if (event === "executePluginMethod" && method) {
      // API wants to invoke a method of this plugin
      this.executeMethod(method, params, connectionID);
    }
  }

  /**
   * Executes a method from this module with the given parameters.
   * The connectionID must be informed in order to sync the result in the API.
   */
  private async executeMethod(
    method: string,
    params: any[],
    connectionID: string,
  ) {
    const event = "pluginMethodResponse";
    const methodExists = !!this[method];

    try {
      if (!methodExists) {
        throw new Error(`Function ${method} is not implemented`);
      }

      // execute the method and send its result
      const result = await this[method](...params);
      parentPort?.postMessage({ event, method, params: result, connectionID });
    } catch (error) {
      // error while invoking method
      const err = error || "Unhandled error";
      parentPort?.postMessage({ event, method, connectionID, error: err });
    }
  }

  /**
   * Validates if this setup ID is not already being used by another plugin.
   * If it is, an error will be thrown. If it's not, then nothing will happen.
   */
  private validateSetupID() {
    if (moduleIDs.has(this.setup.id)) {
      throw new Error(`Setup ID already in use (${this.setup.id})`);
    }
    moduleIDs.set(this.setup.id, true);
  }
}

export default TCoreModule;
