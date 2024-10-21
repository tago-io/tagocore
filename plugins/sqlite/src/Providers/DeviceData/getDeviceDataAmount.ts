import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Retrieves the amount of data in a device.
 */
async function getDeviceDataAmount(
  deviceID: TGenericID,
  type: TDeviceType,
): Promise<number> {
  const client = await getDeviceConnection(deviceID, type);
  const data = await client.count("id as amount").from("data");

  const amount = Number((data[0] as any).amount);
  return amount;
}

export default getDeviceDataAmount;
