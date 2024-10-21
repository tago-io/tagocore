import type {
  IDatabaseGetDeviceDataQuery,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 */
async function getDeviceDataCount(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery,
): Promise<number> {
  const client = await getDeviceConnection(deviceID, type);
  const { variables, start_date, end_date, values, groups, ids } = query;

  const knexQuery = client.read("data").count("id as amount").limit(1).first();

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

  return Number(data?.amount || 0);
}

export default getDeviceDataCount;
