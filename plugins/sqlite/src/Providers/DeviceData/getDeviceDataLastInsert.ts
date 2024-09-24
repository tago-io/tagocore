import { IDeviceData, IDatabaseGetDeviceDataQuery, TGenericID, TDeviceType } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";
import finishBucketDataQuery from "./finishDeviceDataQuery";

/**
 * Retrieves from a device the last data item sorted by descending `created_at`.
 */
async function getDeviceDataLastInsert(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);

  const knexQuery = client.orderBy("created_at", "DESC").limit(1);

  return finishBucketDataQuery(client, knexQuery, query);
}

export default getDeviceDataLastInsert;
