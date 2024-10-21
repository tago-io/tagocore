import { Account } from "@tago-io/sdk";
import type { DeviceInfo } from "@tago-io/sdk/out/modules/Account/devices.types";
import type { IDeviceEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function editDevice(id: TGenericID, data: IDeviceEdit): Promise<void> {
  const account = new Account({ token: store.token });
  await account.devices.edit(id, data as Partial<DeviceInfo>);
}

export default editDevice;
