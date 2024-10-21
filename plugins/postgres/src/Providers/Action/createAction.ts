import type { IDatabaseCreateActionData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Creates a new action.
 */
async function createAction(data: IDatabaseCreateActionData): Promise<void> {
  if (Array.isArray(data.trigger)) {
    data.trigger = JSON.stringify(data.trigger);
  }

  await mainDB.write.insert(data).into("action");
}

export default createAction;
