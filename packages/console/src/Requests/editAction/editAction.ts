import { Resources } from "@tago-io/sdk";
import type { ActionCreateInfo } from "@tago-io/sdk/lib/types";
import type { IActionEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../../System/Store.ts";

async function editAction(id: TGenericID, data: IActionEdit): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.actions.edit(id, data as Partial<ActionCreateInfo>);
}

export default editAction;
