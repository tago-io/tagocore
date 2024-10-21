import type {
  IDatabaseCreateDeviceTokenData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Generates and retrieves a new device token.
 */
async function createDeviceToken(
  deviceID: TGenericID,
  data: IDatabaseCreateDeviceTokenData,
): Promise<void> {
  const object = { ...data, device_id: deviceID };
  await knexClient.insert(object).into("device_token");
}

export default createDeviceToken;
