import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Empties a device.
 */
async function emptyBucket(
  deviceID: TGenericID,
  type: TDeviceType,
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);
  await client.delete().from("data");
}

export default emptyBucket;
