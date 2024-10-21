import type { IAction, TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves all the information of an action.
 */
async function getActionInfo(actionID: TGenericID): Promise<IAction | null> {
  const response = await knexClient
    .select()
    .select("*")
    .from("action")
    .where("id", actionID)
    .first();

  if (response) {
    response.active = Boolean(response.active);
    response.lock = Boolean(response.lock);
    response.created_at = new Date(response.created_at);
    response.tags = JSON.parse(response.tags);

    if (response.action) {
      response.action = JSON.parse(response.action);
    }
    if (response.trigger) {
      response.trigger = JSON.parse(response.trigger);
    }
    if (response.device_info) {
      response.device_info = JSON.parse(response.device_info);
    }
    if (response.last_triggered) {
      response.last_triggered = new Date(response.last_triggered);
    }
    if (response.updated_at) {
      response.updated_at = new Date(response.updated_at);
    }
  }

  return response;
}

export default getActionInfo;
