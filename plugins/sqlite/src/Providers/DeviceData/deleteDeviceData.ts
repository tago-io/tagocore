import { TGenericID, TDeviceType } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 * Deletes data from a device.
 */
async function deleteDeviceData(deviceID: TGenericID, type: TDeviceType, ids: string[]): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);
  await client.delete().from("data").whereIn("id", ids);
}

export default deleteDeviceData;
