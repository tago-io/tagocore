import os from "node:os";
import path from "node:path";
import {
  type IActionTypeModuleSetup,
  zPluginType,
} from "@tago-io/tcore-sdk/types";
import type { Application, Request, Response } from "express";
import multer from "multer";
import { z } from "zod";
import { plugins } from "../Plugins/Host.ts";
import { uninstallPlugin } from "../Plugins/Uninstall.ts";
import {
  activatePlugin,
  addExternalPlugin,
  deactivatePlugin,
  disablePlugin,
  enablePlugin,
  getAllInsidePlugins,
  getAllInstalledPlugins,
  getLoadedPluginList,
  getModuleList,
  getPluginInfo,
  invokeOnCallModule,
  reloadPlugin,
  startPlugin,
  startPluginModule,
  stopPlugin,
  stopPluginModule,
} from "../Services/Plugins.ts";
import {
  getMainSettings,
  setPluginModulesSettings,
} from "../Services/Settings.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Configuration for type in the query string.
 */
const zQueryStringType = z.object({
  type: zPluginType.nullish(),
});

/**
 * Configuration of a `folder` property in the body param.
 */
const zBodyFolderParser = z.object({
  folder: z.string(),
});

/**
 * Configuration for query strings of the uninstall route.
 */
const zUninstallQueryString = z.object({
  keep_data: z
    .preprocess((e) => e === "true" || e === "1", z.boolean())
    .optional(),
});

type IURLParamsID = z.infer<typeof zURLParamsID>;

/**
 * Lists all the database plugins.
 */
class UninstallPlugin extends APIController<
  void,
  z.infer<typeof zUninstallQueryString>,
  IURLParamsID
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
    zQueryStringParser: zUninstallQueryString,
  };

  public async main() {
    const response = await uninstallPlugin(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Lists all modules or modules from a specific type.
 */
class ListModules extends APIController<
  void,
  z.infer<typeof zQueryStringType>,
  void
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zQueryStringType,
  };

  public async main() {
    const modules = getModuleList(this.queryStringParams.type);
    const response = modules.map((x) => ({
      pluginID: x.plugin?.id,
      pluginName: x.plugin?.tcoreName,
      setupID: x.setup.id,
      setupName: x.setup.name,
      setup: x.setup,
    }));
    this.body = response;
  }
}

/**
 * Lists all the plugins.
 */
class ListPlugins extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getLoadedPluginList();
    this.body = response;
  }
}

/**
 * Invokes a module's onCall function.
 */
class InvokeOnCallModule extends APIController<void, void, any> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: z.any(),
    zBodyParser: z.any(),
  };

  public async main() {
    const response = await invokeOnCallModule(
      this.urlParams.pluginID,
      this.urlParams.moduleID,
      this.bodyParams,
    );
    this.body = response;
  }
}

/**
 * Starts/restarts a plugin module.
 */
class StartPluginModule extends APIController<void, void, any> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: z.any(),
  };

  public async main() {
    await startPluginModule(this.urlParams.pluginID, this.urlParams.moduleID);
  }
}

/**
 * Stops a plugin module.
 */
class StopPluginModule extends APIController<void, void, any> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: z.any(),
  };

  public async main() {
    await stopPluginModule(this.urlParams.pluginID, this.urlParams.moduleID);
  }
}

/**
 * Uploads a plugin .tcore file.
 */
class UploadPlugin extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
  };

  public async main() {
    const file = this.req.file;
    if (!file || !file.path) {
      throw new Error("Unknown error");
    }
    this.body = file.path;
  }
}

/**
 * Enables a plugin (if not enabled yet).
 */
class EnablePlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await enablePlugin(this.urlParams.id);
  }
}

/**
 * Disables a plugin (if not disabled yet).
 */
class DisablePlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await disablePlugin(this.urlParams.id);
  }
}

/**
 * Starts a plugin (if not started yet).
 */
class StartPlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await startPlugin(this.urlParams.id);
  }
}

/**
 * Stops a plugin (if not Stopped yet).
 */
class StopPlugin extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await stopPlugin(this.urlParams.id);
  }
}

/**
 * Edits a plugin's settings.
 */
class EditPluginSettings extends APIController<any, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
    zBodyParser: z.any(),
  };

  public async main() {
    await setPluginModulesSettings(this.urlParams.id, this.bodyParams);
  }
}

/**
 */
class ReloadPlugin extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await reloadPlugin(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Lists all the plugins.
 */
class GetPluginInfo extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getPluginInfo(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Lists all the plugins in store.
 */
class PluginStore extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getAllInsidePlugins();
    this.body = response;
  }
}

/**
 * Get plugin info.
 */
class PluginStoreInfo extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const plugins = await getAllInsidePlugins();
    const plugin = plugins.find((x: any) => x.id === this.urlParams.id);
    this.body = plugin;
  }
}

/**
 * Get list of installed plugins.
 */
class InstalledPlugins extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const plugins = await getAllInstalledPlugins();
    this.body = plugins;
  }
}

/**
 * Activate a plugin from store.
 */
class ActivatePlugin extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    this.body = await activatePlugin(this.urlParams.id);
  }
}

/**
 * Deactivate a plugin from store.
 */
class DeactivatePlugin extends APIController<void, void, IURLParamsID> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    this.body = await deactivatePlugin(this.urlParams.id);
  }
}

/**
 * Add an external plugin
 */
class AddExternalPlugin extends APIController<
  z.infer<typeof zBodyFolderParser>,
  void,
  void
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zBodyParser: zBodyFolderParser,
  };

  public async main() {
    this.body = await addExternalPlugin(this.bodyParams.folder);
  }
}

/**
 * Gets the info of the main database plugin (if it is set).
 */
class GetDatabasePluginInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const settings = await getMainSettings();
    const pluginID = String(settings.database_plugin).split(":")[0];
    const response = await getPluginInfo(pluginID);
    this.body = response;
  }
}

/**
 * Resolves the request for a plugin image.
 */
export async function resolvePluginImage(req: Request, res: Response) {
  const { type, identifier } = req.params;
  const plugin = plugins.get(req.params.plugin);
  const tcorePkg = plugin?.package?.tcore;
  let fullImagePath = "";

  if (plugin && tcorePkg) {
    if (type === "icon" && tcorePkg.icon) {
      // icon (thumbnail/logo) of the plugin
      fullImagePath = path.join(plugin.folder, tcorePkg.icon);
    } else if (type === "action") {
      // icon for the action type
      const module = plugin.modules.get(identifier);
      const option = (module?.setup as any as IActionTypeModuleSetup)?.option;
      fullImagePath =
        option?.icon?.replace("$PLUGIN_FOLDER$", plugin.folder) || "";
    }
  } else {
    const pluginsStore = await getAllInsidePlugins();
    const pluginStore = pluginsStore.find(
      (x: any) => x.id === req.params.plugin,
    );
    if (pluginStore) {
      if (type === "icon") {
        fullImagePath = path.join(pluginStore.fullPath, pluginStore.icon);
      }
    }
  }

  if (fullImagePath) {
    res.sendFile(fullImagePath);
  } else {
    res.sendStatus(404);
  }
}

/**
 * Resolves the request for a plugin image.
 */
export async function resolvePluginImage2(req: Request, res: Response) {
  const split = req.path.split("/").filter((x) => x);
  split.splice(0, 1);

  const [pluginID] = split.splice(0, 1); // pop the plugin id
  const plugin = plugins.get(pluginID);
  if (!plugin) {
    const pluginsStore = await getAllInsidePlugins();
    const pluginStore = pluginsStore.find(
      (x: any) => x.id === req.params.plugin,
    );
    if (pluginStore) {
      const imgPath = split.join(path.sep);
      const fullImagePath = path.join(pluginStore.fullPath, imgPath);
      if (fullImagePath) {
        return res.sendFile(fullImagePath);
      }
    }
    return res.sendStatus(404);
  }

  const imgPath = split.join(path.sep);
  const fullPath = path.join(plugin.folder, imgPath);

  if (fullPath) {
    return res.sendFile(fullPath);
  }
  return res.sendStatus(404);
}

/**
 * Exports the plugin routes.
 */
export default (app: Application) => {
  const upload = multer({
    dest: path.join(os.tmpdir(), "tcore-plugin-download"),
  });
  app.post("/plugin/upload", upload.single("plugin"), warm(UploadPlugin));

  app.get("/module", warm(ListModules));
  app.get("/plugin-uninstall/:id", warm(UninstallPlugin));
  app.get("/plugin", warm(ListPlugins));
  app.get("/plugin/database", warm(GetDatabasePluginInfo));
  app.get("/plugin/:id", warm(GetPluginInfo));
  app.get("/plugins/store", warm(PluginStore));
  app.get("/plugins/store/:id", warm(PluginStoreInfo));
  app.get("/plugins/installed", warm(InstalledPlugins));
  app.post("/plugins/activate/:id", warm(ActivatePlugin));
  app.post("/plugins/deactivate/:id", warm(DeactivatePlugin));
  app.post("/plugin/addexternalplugin", warm(AddExternalPlugin));
  app.post("/plugin/:id/reload", warm(ReloadPlugin));
  app.post("/plugin/:pluginID/:moduleID/call", warm(InvokeOnCallModule));
  app.post("/plugin/:pluginID/:moduleID/start", warm(StartPluginModule));
  app.post("/plugin/:pluginID/:moduleID/stop", warm(StopPluginModule));
  app.put("/plugin/:id", warm(EditPluginSettings));
  app.post("/plugin/:id/enable", warm(EnablePlugin));
  app.post("/plugin/:id/disable", warm(DisablePlugin));
  app.post("/plugin/:id/start", warm(StartPlugin));
  app.post("/plugin/:id/stop", warm(StopPlugin));
};
