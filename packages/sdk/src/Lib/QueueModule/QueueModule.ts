import {
  type IDatabaseDeviceDataCreate,
  type IModuleSetupWithoutType,
  TDeviceType,
  type TGenericID,
} from "../../Types/index.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a new queue plugin.
 */
class QueueModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "queue");
  }

  /**
   * Trigger this function when data added to device.
   * The data is already parsed and encoded.
   */
  public async onAddDeviceData(
    deviceID: TGenericID,
    data: IDatabaseDeviceDataCreate[],
  ): Promise<void> {
    throw new Error("Method not implemented");
  }
}

export default QueueModule;
