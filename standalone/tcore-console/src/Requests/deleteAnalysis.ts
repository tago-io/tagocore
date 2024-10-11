import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.tsx";

/**
 */
async function deleteAnalysis(id: TGenericID): Promise<void> {
  const account = new Account({ token: store.token });
  await account.analysis.delete(id);
}

export default deleteAnalysis;
