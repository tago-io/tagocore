import {
  IDatabaseGetDeviceDataQuery,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { deviceDB } from "../../Database";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 */
async function getDeviceDataAvg(
  deviceID: TGenericID,
  type: TDeviceType,
  params: IDatabaseGetDeviceDataQuery
): Promise<number> {
  const client = await getDeviceConnection(deviceID, type);
  const { variables, start_date, end_date, values, groups, ids } = params;

  const knexQuery = client
    .read("data")
    .select(deviceDB.read.raw(`AVG(value) as avg`))
    .count("id")
    .timeout(10000)

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

  return Number(data?.avg || 0);
}

export default getDeviceDataAvg;
