import { Resources } from "@tago-io/sdk";
import type { TokenData } from "@tago-io/sdk/lib/types";
import type {
  IDeviceTokenCreate,
  IDeviceTokenCreateResponse,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function createDeviceToken(
  deviceID: TGenericID,
  data: Omit<IDeviceTokenCreate, "token" | "created_at">,
): Promise<IDeviceTokenCreateResponse> {
  const resources = new Resources({ token: store.token });
  const result = await resources.devices.tokenCreate(
    deviceID,
    data as TokenData,
  );

  return result as unknown as IDeviceTokenCreateResponse;
}

export default createDeviceToken;
