import { Resources } from "@tago-io/sdk";
import type { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function getDeviceInfo(id: TGenericID): Promise<IDevice> {
  const resources = new Resources({ token: store.token });
  const device = await resources.devices.info(id);

  return device as any as IDevice;
}

export default getDeviceInfo;
