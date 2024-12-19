import { Resources } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function getDeviceDataAmount(id: TGenericID) {
  const resources = new Resources({ token: store.token });
  const amount = await resources.devices.amount(id);

  return amount;
}

export default getDeviceDataAmount;
