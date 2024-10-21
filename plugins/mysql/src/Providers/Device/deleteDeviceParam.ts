import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Deletes a device's param.
 */
async function deleteDeviceParam(deviceID: TGenericID): Promise<void> {
  await mainDB.write.delete().from("device_params").where("id", deviceID);
}

export default deleteDeviceParam;
