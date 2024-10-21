import type {
  IDatabaseGetDeviceDataQuery,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Retrieves the sum of all items in a device.
 */
async function getDeviceDataSum(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery,
): Promise<number> {
  const client = await getDeviceConnection(deviceID, type);
  const { variables, start_date, end_date, values, groups, ids } = query;

  const knexQuery = client
    .select(client.raw("SUM(value) as sum"))
    .count("id")
    .timeout(10000)
    .from("data")
    .where("type", "number")
    .whereNotNull("value")
    .first();

  if (groups) {
    knexQuery.whereIn("group", groups);
  }

  if (ids) {
    knexQuery.whereIn("id", ids);
  }

  if (values) {
    knexQuery.whereIn("value", values);
  }

  if (start_date) {
    knexQuery.where("time", ">=", start_date);
  }

  if (end_date) {
    knexQuery.where("time", "<=", end_date);
  }

  if (variables) {
    knexQuery.whereIn("variable", variables);
  }

  const data = await knexQuery;

  return Number(data?.sum || 0);
}

export default getDeviceDataSum;
