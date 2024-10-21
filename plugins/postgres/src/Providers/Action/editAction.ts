import type {
  IDatabaseEditActionData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Edits an action.
 */
async function editAction(
  actionID: TGenericID,
  data: IDatabaseEditActionData,
): Promise<void> {
  if (Array.isArray(data.trigger)) {
    data.trigger = JSON.stringify(data.trigger);
  }

  await mainDB.write.update(data).from("action").where("id", actionID);
}

export default editAction;
