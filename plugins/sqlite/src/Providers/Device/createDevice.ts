import type { IDatabaseCreateDeviceData } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import { knexClient } from "../../knex.ts";

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

  await knexClient.insert(object).into("device");

  // to create the device data table
  await getDeviceConnection(object.id, object.type);
}

export default createDevice;
