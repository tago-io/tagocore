import { Resources } from "@tago-io/sdk";
import type { DeviceInfo } from "@tago-io/sdk/lib/types";
import type { IDeviceEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function editDevice(id: TGenericID, data: IDeviceEdit): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.devices.edit(id, data as Partial<DeviceInfo>);
}

export default editDevice;
