import fs from "node:fs";
/* eslint-disable no-unused-vars */
import path from "node:path";
import type {
  IPluginPublisher,
  TPluginState,
  TPluginType,
} from "@tago-io/tcore-sdk/types";
import md5 from "md5";
import { logError } from "../../Helpers/log.ts";
import { setPluginDisabledSettings } from "../../Services/Settings.ts";
import { io } from "../../Socket/SocketServer.ts";
import { DEV_BUILT_IN_PLUGINS } from "../Host.ts";
import type M from "../Module/Module.ts";
import { generatePluginID } from "../PluginID.ts";
import Validator from "../Validator/Validator.ts";
import Worker from "../Worker/Worker.ts";

/**
 */
class Plugin {
  public package: any;
  public permissions: string[];
  public types: TPluginType[];
  public builtIn = false;

  public readonly version: string;
  public readonly id: string;
  public readonly packageName: string;
  public readonly tcoreName: string;
  public readonly publisher: IPluginPublisher;
  public readonly description: string;
  public fullDescription: string | null = null;

  public error?: string | null = null;
  public modules: Map<string, M>;
  public state: TPluginState;
  public validator: Validator;
  public worker: Worker;

  /**
   * Generates a plugin ID based on the plugin name.
   */
  public static generatePluginID(packageName: string): string {
    if (!packageName) {
      return "";
    }
    const id = md5(packageName);
    return id as string;
  }

  constructor(public folder: string) {
    this.validator = new Validator(this);
    this.state = "idle";
    this.modules = new Map();
    this.worker = new Worker(this);

    this.package = Plugin.getPackage(this.folder);
    this.permissions = this.package?.tcore?.permissions || [];
    this.types = this.package?.tcore?.types || [];

    this.description = this.package.tcore.short_description;
    this.id = generatePluginID(this.package.name);
    this.packageName = this.package.name;
    this.publisher = this.package.tcore.publisher;
    this.tcoreName = this.package.tcore.name;
    this.version = this.package.version;

    this.builtIn = DEV_BUILT_IN_PLUGINS.includes(folder);

    this.loadFullDescription();
  }

  /**
   */
  public async start() {
    if (this.state === "starting" || this.state === "started") {
      throw new Error("Plugin already started");
    }

    try {
      this.validator.validatePackageJSON();
    } catch (ex: any) {
      this.state = "stopped";
      this.error = ex?.message || ex;
      this.emitSocketUpdate();
      throw ex;
    }

    try {
      this.state = "starting";
      this.modules.clear();
      this.emitSocketUpdate();

      await new Promise((resolve, reject) => {
        this.worker.start();
        this.worker.on("uncaughtException", reject);
        this.worker.on("start", resolve);
      });

      this.state = "started";
      this.error = null;
    } catch (ex: any) {
      this.state = "stopped";
      this.error = this.error || ex.message || ex;
      throw ex;
    } finally {
      this.emitSocketUpdate();
    }
  }

  /**
   */
  public async stop(force = false, timeout = 30000) {
    if (this.state === "stopped") {
      throw new Error("Plugin already stopped");
    }

    if (force) {
      // quickly stop executing whole plugin
      for (const module of this.modules.values()) {
        module.state = "stopped";
      }
      this.state = "stopped";
      this.worker.stop();
      this.emitSocketUpdate();
    } else {
      // gracefully stop plugin waiting for onDestroy
      this.state = "stopping";
      this.emitSocketUpdate();

      // creates a rejection timeout in order to prevent the plugin
      // from taking too long to destroy. If the timeout is exceeded then the
      // plugin will be destroyed forcefully
      const rejectTimeout = setTimeout(() => {
        this.stop(true);
        logError(
          "api",
          `Plugin "${this.tcoreName}" exceeded the shutdown timeout and was terminated.`,
        );
      }, timeout);

      for (const module of this.modules.values()) {
        await module.stop().catch(() => null);
      }

      // this setTimeout is here to prevent the napi_error from node. The error
      // happens when you send messages and try to kill the worker immediately
      // after. This prevents the error from being thrown.
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.state = "stopped";
          this.worker.stop();
          this.emitSocketUpdate();
          resolve();
          clearTimeout(rejectTimeout);
        }, 200);
      });
    }
  }

  /**
   */
  public async disable() {
    if (this.state !== "disabled") {
      await this.stop(true).catch(() => null);
      this.error = null;
      this.state = "disabled";
      this.emitSocketUpdate();
      await setPluginDisabledSettings(this.id, true);
    }
  }

  /**
   */
  public async enable() {
    this.package = Plugin.getPackage(this.folder);
    this.permissions = this.package?.tcore?.permissions || [];
    this.types = this.package?.tcore?.types || [];

    await this.start().catch(() => null);
    await setPluginDisabledSettings(this.id, false);
  }

  /**
   */
  private loadFullDescription() {
    const relativePath = this.package.tcore.full_description;
    if (relativePath) {
      const fullPath = path.join(this.folder, relativePath);
      const data = fs.readFileSync(fullPath, "utf8");
      this.fullDescription = data;
    }
  }

  /**
   */
  public emitSocketUpdate() {
    io?.to(`plugin#${this.id}`).emit("plugin::status", {
      id: this.id,
      state: this.state,
      error: this.error || undefined,
    });
    this.emitSidebarSocketUpdate();
  }

  /**
   */
  public emitSidebarSocketUpdate() {
    const modulesError = [...this.modules.values()].some((x) => x.error);
    io?.to(`plugin#${this.id}`).emit("plugin::sidebar", {
      id: this.id,
      state: this.state,
      error: !!this.error || modulesError || undefined,
    });
  }

  /**
   */
  public static getPackage(folder: string) {
    try {
      const filePath = path.join(folder, "package.json");
      const pkg = fs.readFileSync(filePath, "utf8");
      return JSON.parse(pkg);
    } catch (ex) {
      throw new Error("Unable to load plugin package.json");
    }
  }

  /**
   */
  public static async getPackageAsync(folder: string) {
    return Plugin.getPackage(folder);
  }

  /**
   */
  public static async returnFullDescription(
    folder: string,
    relativePath: string,
  ) {
    const fullPath = path.join(folder, relativePath);
    const data = fs.readFileSync(fullPath, "utf8");
    if (!data) {
      return "";
    }
    return data;
  }
}

export default Plugin;
