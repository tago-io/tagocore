import { Resources } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function deleteDevice(id: TGenericID): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.devices.delete(id);
}

export default deleteDevice;
