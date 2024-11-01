import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function deleteBucketVariables(
  id: TGenericID,
  params: any,
): Promise<void> {
  const account = new Account({ token: store.token });
  await account.buckets.deleteVariable(id, params);
}

export default deleteBucketVariables;
