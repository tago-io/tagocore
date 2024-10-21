import { Account } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function deleteDevice(id: TGenericID): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.delete(id);
}

export default deleteDevice;
