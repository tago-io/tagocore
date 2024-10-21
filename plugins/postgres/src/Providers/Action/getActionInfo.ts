import type { IAction, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the information of an action.
 */
async function getActionInfo(actionID: TGenericID): Promise<IAction | null> {
  const response = await mainDB.read
    .select("*")
    .from("action")
    .where("id", actionID)
    .first();

  return response;
}

export default getActionInfo;
