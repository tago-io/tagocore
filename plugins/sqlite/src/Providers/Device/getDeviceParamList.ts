import type {
  IDeviceParameterList,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Gets all the parameters of a device.
 */
async function getDeviceParamList(
  deviceID: TGenericID,
  sentStatus?: boolean,
): Promise<IDeviceParameterList> {
  const query = knexClient
    .select()
    .select("*")
    .from("device_params")
    .where("device_id", deviceID);

  if (sentStatus !== undefined) {
    query.where("sent", !!sentStatus);
  }

  const response = await query;
  return response;
}

export default getDeviceParamList;
