import type {
  IDatabaseGetDeviceTokenListQuery,
  IDeviceTokenList,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves a list of device tokens.
 */
async function getDeviceTokenList(
  deviceID: TGenericID,
  query: IDatabaseGetDeviceTokenListQuery,
): Promise<IDeviceTokenList> {
  const response = (await knexClient
    .select("*")
    .from("device_token")
    .where("device_id", deviceID)) as IDeviceTokenList;

  for (const item of response) {
    item.created_at = new Date(item.created_at);
  }

  return response;
}

export default getDeviceTokenList;
