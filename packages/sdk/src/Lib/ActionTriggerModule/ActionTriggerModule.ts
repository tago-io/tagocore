import type { IActionTriggerModuleSetup, TGenericID } from "../../Types.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a new Action type.
 */
class ActionTriggerModule extends TCoreModule {
  constructor(protected setup: IActionTriggerModuleSetup) {
    super(setup, "action-trigger");
  }

  /**
   * Called when this action type is triggered.
   * This will decide if the action should be executed or not.
   */
  public async onCall(
    actionID: TGenericID,
    values: any,
    data: any,
  ): Promise<void> {
    return Promise.resolve();
  }

  /**
   * Called when the triggers of an action change.
   */
  public async onTriggerChange(
    actionID: TGenericID,
    trigger: any,
  ): Promise<void> {
    //
  }
}

export default ActionTriggerModule;
