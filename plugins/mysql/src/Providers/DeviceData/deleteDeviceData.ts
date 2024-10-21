import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Deletes data from a device.
 */
async function deleteDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  ids: string[],
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);
  await client.write("data").delete().whereIn("id", ids);
}

export default deleteDeviceData;
