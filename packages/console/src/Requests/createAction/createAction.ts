import { Resources } from "@tago-io/sdk";
import type { ActionCreateInfo } from "@tago-io/sdk/lib/types";
import type { IActionCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../../System/Store.ts";

async function createAction(
  data: Omit<IActionCreate, "id" | "created_at">,
): Promise<TGenericID> {
  const resources = new Resources({ token: store.token });
  const result = await resources.actions.create(data as ActionCreateInfo);

  return result.action;
}

export default createAction;
