import { Account } from "@tago-io/sdk";
import type { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 * Retrieves all information of a single device.
 */
async function getDeviceInfo(id: TGenericID): Promise<IDevice> {
  const account = new Account({ token: store.token });
  const device = await account.devices.info(id);
  return device as any as IDevice;
}

export default getDeviceInfo;
