import { IDevice, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

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

  if (response) {
    response.active = Boolean(response.active);
    response.created_at = new Date(response.created_at);
    response.tags = JSON.parse(response.tags);

    if (response.last_input) {
      response.last_input = new Date(response.last_input);
    }
    if (response.last_output) {
      response.last_output = new Date(response.last_output);
    }
    if (response.inspected_at) {
      response.inspected_at = new Date(response.inspected_at);
    }
    if (response.updated_at) {
      response.updated_at = new Date(response.updated_at);
    }
    if (response.created_at) {
      response.created_at = new Date(response.created_at);
    }
    if (response.encoder_stack) {
      response.encoder_stack = JSON.parse(response.encoder_stack);
    }
  }

  return response as IDevice;
}

export default getDeviceInfo;
