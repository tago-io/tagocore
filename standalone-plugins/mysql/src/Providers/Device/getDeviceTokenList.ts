import {
  IDatabaseGetDeviceTokenListQuery,
  IDeviceTokenList,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database";

/**
 * Retrieves a list of device tokens.
 */
async function getDeviceTokenList(
  deviceID: TGenericID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: IDatabaseGetDeviceTokenListQuery
): Promise<IDeviceTokenList> {
  const response = (await mainDB.write
    .select("*")
    .from("device_token")
    .where("device_id", deviceID)) as IDeviceTokenList;

  for (const item of response) {
    item.created_at = new Date(item.created_at);
  }

  return response;
}

export default getDeviceTokenList;
