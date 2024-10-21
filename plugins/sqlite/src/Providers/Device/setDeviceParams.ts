import type {
  IDatabaseSetDeviceParamsData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Overrides the device parameters.
 */
async function setDeviceParams(
  deviceID: TGenericID,
  data: IDatabaseSetDeviceParamsData[],
): Promise<void> {
  await knexClient.delete().from("device_params").where("device_id", deviceID);

  for (const item of data) {
    const object = { ...item, device_id: deviceID };

    await knexClient.insert(object).into("device_params");
  }
}

export default setDeviceParams;
