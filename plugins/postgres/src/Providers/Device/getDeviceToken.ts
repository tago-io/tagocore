import type { IDeviceToken, TGenericToken } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves the token info of a particular uuid.
 */
async function getDeviceToken(
  token: TGenericToken,
): Promise<IDeviceToken | null> {
  const response = await mainDB.read
    .select("*")
    .from("device_token")
    .where("token", token)
    .first();

  if (response) {
    response.created_at = new Date(response.created_at);
    return response;
  }

  return null;
}

export default getDeviceToken;
