import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { destroyDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import { knexClient } from "../../knex.ts";

/**
 * Deletes a device.
 */
async function deleteDevice(deviceID: TGenericID): Promise<void> {
  await knexClient.delete().from("device").where("id", deviceID);
  await destroyDeviceConnection(deviceID);
}

export default deleteDevice;
