import type { IDatabaseCreateDeviceData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Creates a new device.
 */
async function createDevice(data: IDatabaseCreateDeviceData): Promise<void> {
  const object = { ...data };

  if (object.tags) {
    object.tags = JSON.stringify(object.tags) as any;
  }
  if (object.encoder_stack) {
    object.encoder_stack = JSON.stringify(object.encoder_stack) as any;
  }

  await mainDB.write.insert(object).into("device");

  // to create the device data table
  await getDeviceConnection(data.id, data.type);
}

export default createDevice;
