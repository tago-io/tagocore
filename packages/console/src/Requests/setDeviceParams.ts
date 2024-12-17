import { Resources } from "@tago-io/sdk";
import type {
  IDeviceParameterCreate,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function setDeviceParams(
  deviceID: TGenericID,
  data: IDeviceParameterCreate[],
): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.devices.paramSet(deviceID, data as any);
}

export default setDeviceParams;
