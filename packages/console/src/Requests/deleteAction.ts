import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function deleteAction(id: TGenericID): Promise<void> {
  const account = new Account({ token: store.token });
  await account.actions.delete(id);
}

export default deleteAction;
