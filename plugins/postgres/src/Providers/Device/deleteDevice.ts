import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Deletes a device.
 */
async function deleteDevice(deviceID: TGenericID): Promise<void> {
  await mainDB.write.delete().from("device").where("id", deviceID);
}

export default deleteDevice;
