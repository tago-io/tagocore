import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function getDeviceDataAmount(id: TGenericID) {
  const account = new Account({ token: store.token });
  const amount = await account.buckets.amount(id);
  return amount;
}

export default getDeviceDataAmount;
