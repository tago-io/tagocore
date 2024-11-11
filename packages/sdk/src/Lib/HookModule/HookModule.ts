import type {
  IDeviceData,
  IModuleSetupWithoutType,
  TGenericID,
} from "../../Types/index.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of listener functions that are triggered
 * when certain events happen in the application.
 */
class HookModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "hook");
  }

  /**
   * Called after the data sent by a device is inserted into the bucket.
   */
  public async onAfterInsertDeviceData(
    deviceID: TGenericID,
    data: IDeviceData[],
  ): Promise<void> {
    // not implemented
  }

  /**
   * Called when the main database module is loaded. This will be called
   * whenever the database module calls its `onLoad` function successfully, which
   * means that this hook may be called multiple times.
   */
  public async onMainDatabaseModuleLoaded(): Promise<void> {
    // not implemented
  }
}

export default HookModule;
