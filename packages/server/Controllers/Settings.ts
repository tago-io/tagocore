import { type ISettings, zSettingsEdit } from "@tago-io/tcore-sdk/types";
import type { Application } from "express";
import { z } from "zod";
import { encryptAccountPassword } from "../Services/Account/AccountPassword.ts";
import { checkMainDatabaseModuleHook } from "../Services/Plugins.ts";
import {
  doFactoryReset,
  getMainSettings,
  setMainSettings,
  setMasterPassword,
} from "../Services/Settings.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

const zPassword = z.object({
  password: z.string().nonempty(),
});

/**
 * Edits the settings.
 */
class EditSettings extends APIController<ISettings, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zSettingsEdit,
  };

  public async main() {
    if (!this.bodyParams.filesystem_plugin) {
      this.bodyParams.master_password = undefined;
    }

    const settings = await getMainSettings();
    const data = { ...settings, ...this.bodyParams };
    await setMainSettings(data);

    if (this.bodyParams.database_plugin) {
      checkMainDatabaseModuleHook();
    }
  }
}

/**
 * Sets the master password.
 */
class SetMasterPassword extends APIController<
  z.infer<typeof zPassword>,
  void,
  void
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
    zBodyParser: zPassword,
  };

  public async main() {
    const settings = await getMainSettings();

    if (settings.master_password) {
      throw new Error("Master password is already set");
    }

    const encrypted = await encryptAccountPassword(this.bodyParams.password);
    await setMasterPassword(encrypted);
  }
}

/**
 * Checks to see if the master password is valid or not.
 */
class CheckMasterPassword extends APIController<any, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: z.any(),
  };

  public async main() {
    this.body = true;
  }
}

/**
 * Performs a factory reset.
 */
class DoFactoryReset extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
  };

  public async main() {
    await doFactoryReset();
    this.body = "Factory reset was successful";
  }
}

/**
 * Retrieves all the information of the settings.
 */
class GetSettingsInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const settings = await getMainSettings();
    this.body = {
      settings,
      metadata: {
        database_plugin_disabled: !!process.env.TCORE_DATABASE_PLUGIN,
        plugin_folder_disabled: !!process.env.TCORE_PLUGINS_FOLDER,
        port_disabled: !!process.env.TCORE_PORT,
      },
    };
  }
}

/**
 * Retrieves only main settings.
 */
class GetMainSettingsInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const settings = await getMainSettings();
    this.body = settings;
  }
}

/**
 * Exports the routes of the device.
 */
export default (app: Application) => {
  app.put("/settings", warm(EditSettings));
  app.get("/settings", warm(GetSettingsInfo));
  app.get("/mainsettings", warm(GetMainSettingsInfo));
  app.post("/check-master-password", warm(CheckMasterPassword));
  app.post("/settings/master/password", warm(SetMasterPassword));
  app.post("/settings/reset", warm(DoFactoryReset));
};
