import { Resources } from "@tago-io/sdk";
import type { DeviceCreateInfo } from "@tago-io/sdk/lib/types";
import type {
  ICreateDeviceResponse,
  IDeviceCreate,
} from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function createDevice(
  data: IDeviceCreate,
): Promise<ICreateDeviceResponse> {
  const resources = new Resources({ token: store.token });
  const result = await resources.devices.create(data as DeviceCreateInfo);

  return result;
}

export default createDevice;
