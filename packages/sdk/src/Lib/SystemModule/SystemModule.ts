import APIBridge from "../APIBridge/APIBridge.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows a plugin to override some system functionality.
 * ! only available internally to certain plugins developed by TagoIO.
 */
class SystemModule extends TCoreModule {
  constructor(protected setup: any) {
    super(setup, "system-override");
  }

  async onInstallStorePlugin(id: string, version: string, platform: string) {
    //
  }

  async onUninstallStorePlugin(id: string) {
    //
  }

  async onEditModuleSettings(pluginID: string, settings: any) {
    //
  }

  async onDisablePlugin(id: string) {
    //
  }

  async onEnablePlugin(id: string) {
    //
  }

  async onStartPluginModule(pluginID: string, moduleID: string) {
    //
  }

  async onStopPluginModule(pluginID: string, moduleID: string) {
    //
  }

  /**
   */
  async exit(code: number) {
    const bridge: any = new APIBridge();
    try {
      await bridge.invokeApiMethod("exitSystem", code);
    } finally {
      (bridge as any).destroy();
    }
  }

  /**
   */
  async emitInstallLog(data: any) {
    const bridge: any = new APIBridge();
    try {
      await bridge.invokeApiMethod("emitInstallLog", data);
    } finally {
      (bridge as any).destroy();
    }
  }
}

export default SystemModule;
