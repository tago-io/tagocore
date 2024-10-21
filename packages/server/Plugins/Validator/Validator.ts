import {
  type IModuleSetup,
  zPluginPackageTCore,
} from "@tago-io/tcore-sdk/types";
import { getSystemName } from "@tago-io/tcore-shared";
/* eslint-disable no-unused-vars */
import semver from "semver";
import pkg from "../../package.json" with { type: "json" };
import type Plugin from "../Plugin/Plugin.ts";

/**
 */
class Validator {
  constructor(public plugin: Plugin) {
    //
  }

  /**
   */
  private validateEngine() {
    const pluginEngineVersion = this.plugin.package?.engines?.tcore || "*";
    const tcoreVersion = pkg.version;
    const valid = semver.satisfies(tcoreVersion, pluginEngineVersion);
    return valid;
  }

  /**
   */
  public validatePackageJSON() {
    const pkg = this.plugin.package;
    if (!pkg.tcore) {
      throw new Error(`"tcore" property missing in package.json`);
    }

    const valid = this.validateEngine();
    if (!valid) {
      throw new Error(
        `Not compatible with this ${getSystemName()} version, only compatible with ${pkg.engines.tcore}`,
      );
    }

    try {
      zPluginPackageTCore.parse(pkg.tcore);
    } catch (err: any) {
      const { fieldErrors } = err.flatten();
      const str = JSON.stringify(fieldErrors, null, 2);
      const msg = `Validation error in package.json:\n${str}`;
      throw new Error(msg);
    }
  }

  /**
   */
  public validateModuleSetup(setup: IModuleSetup) {
    const allowed = this.plugin.types.includes(setup.type);
    if (!allowed) {
      throw new Error(`Not allowed to start a "${setup.type}" module`);
    }
  }
}

export default Validator;
