import { Account } from "@tago-io/sdk";
import type { IDeviceParameterCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function setDeviceParams(
  deviceID: TGenericID,
  data: IDeviceParameterCreate[]
): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.paramSet(deviceID, data as any);
}

export default setDeviceParams;
