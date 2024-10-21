import type { IDatabaseCreateActionData } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Creates a new action.
 */
async function createAction(data: IDatabaseCreateActionData): Promise<void> {
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

  await knexClient.insert(object).into("action");
}

export default createAction;
