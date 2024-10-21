import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function runAnalysis(id: TGenericID): Promise<void> {
  const account = new Account({ token: store.token });
  await account.analysis.run(id);
}

export default runAnalysis;
