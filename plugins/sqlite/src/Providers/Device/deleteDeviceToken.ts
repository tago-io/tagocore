import type { TGenericToken } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Deletes a device's token.
 */
async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  await knexClient.delete().from("device_token").where("token", token);
}

export default deleteDeviceToken;
