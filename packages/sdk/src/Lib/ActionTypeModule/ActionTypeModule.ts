import type { IActionTypeModuleSetup, TGenericID } from "../../Types.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a new Action type.
 */
class ActionTypeModule extends TCoreModule {
  constructor(protected setup: IActionTypeModuleSetup) {
    super(setup, "action-type");
  }

  /**
   * Called when this action type is executed.
   */
  public async onCall(actionID: TGenericID, values: any, data: any): Promise<void> {
    return Promise.resolve();
  }
}

export default ActionTypeModule;
