import { Account } from "@tago-io/sdk";
import type { ActionCreateInfo } from "@tago-io/sdk/out/modules/Account/actions.types";
import type { IActionEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../../System/Store.ts";

/**
 */
async function editAction(id: TGenericID, data: IActionEdit): Promise<void> {
  const account = new Account({ token: store.token });
  await account.actions.edit(id, data as Partial<ActionCreateInfo>);
}

export default editAction;
