import type {
  IDatabaseEditDeviceData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Edits a device.
 */
async function editDevice(
  deviceID: TGenericID,
  data: IDatabaseEditDeviceData,
): Promise<void> {
  await mainDB.write.update(data).from("device").where("id", deviceID);
}

export default editDevice;
