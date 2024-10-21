import type {
  IDatabaseEditDeviceData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Edits a device.
 */
async function editDevice(
  deviceID: TGenericID,
  data: IDatabaseEditDeviceData,
): Promise<void> {
  const object = { ...data };

  if (object.tags) {
    object.tags = JSON.stringify(object.tags) as any;
  }
  if (object.encoder_stack) {
    object.encoder_stack = JSON.stringify(object.encoder_stack) as any;
  }

  await knexClient.update(object).from("device").where("id", deviceID);
}

export default editDevice;
