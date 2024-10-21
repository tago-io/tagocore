import type { IDevice, TGenericToken } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import getDeviceInfo from "./getDeviceInfo.ts";

/**
 * Retrieves all the information of a device via its token
 */
async function getDeviceByToken(token: TGenericToken): Promise<IDevice | null> {
  const response = await mainDB.write
    .select("device_id")
    .from("device_token")
    .where("token", token)
    .first();

  if (response) {
    return await getDeviceInfo(response.device_id);
  }

  return null;
}

export default getDeviceByToken;
