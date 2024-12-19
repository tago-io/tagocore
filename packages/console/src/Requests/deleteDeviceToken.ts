import { Resources } from "@tago-io/sdk";
import type { TGenericToken } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.devices.tokenDelete(token);
}

export default deleteDeviceToken;
