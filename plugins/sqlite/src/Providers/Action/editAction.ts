import type {
  IDatabaseEditActionData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Edits an action.
 */
async function editAction(
  actionID: TGenericID,
  data: IDatabaseEditActionData,
): Promise<void> {
  const object = { ...data };

  if (object.trigger) {
    object.trigger = JSON.stringify(object.trigger) as any;
  }
  if (object.action) {
    object.action = JSON.stringify(object.action) as any;
  }
  if (object.tags) {
    object.tags = JSON.stringify(object.tags) as any;
  }

  await knexClient.update(object).from("action").where("id", actionID);
}

export default editAction;
