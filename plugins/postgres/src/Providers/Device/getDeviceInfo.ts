import type { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the information of a device.
 */
async function getDeviceInfo(deviceID: TGenericID): Promise<IDevice | null> {
  const response = await mainDB.write
    .select()
    .select("*")
    .from("device")
    .where("id", deviceID)
    .first();

  return response as IDevice;
}

export default getDeviceInfo;
