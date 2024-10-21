import type {
  IDatabaseGetDeviceDataQuery,
  IDeviceData,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import finishBucketDataQuery from "./finishDeviceDataQuery.ts";

/**
 * Retrieves from a device the first data item sorted by descending `created_at`.
 */
async function getDeviceDataFirstInsert(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery,
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.read("data").orderBy("created_at", "ASC").limit(1);

  return finishBucketDataQuery(client.read("data"), knexQuery, query);
}

export default getDeviceDataFirstInsert;
