import type {
  IDatabaseGetDeviceDataQuery,
  IDeviceData,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import finishBucketDataQuery from "./finishDeviceDataQuery.ts";

/**
 * Retrieves from a device the first data item that contains a location.
 */
async function getDeviceDataFirstLocation(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery,
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client
    .whereNotNull("location")
    .orderBy("time", "ASC")
    .limit(1);

  return finishBucketDataQuery(client, knexQuery, query);
}

export default getDeviceDataFirstLocation;
