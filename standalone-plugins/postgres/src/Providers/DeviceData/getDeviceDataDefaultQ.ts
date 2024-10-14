import {
  IDeviceData,
  IDatabaseGetDeviceDataQuery,
  TGenericID,
  TDeviceType,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase";

/**
 * Retrieves data from a device using the default query.
 */
async function getDeviceDataDefaultQ(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDatabaseGetDeviceDataQuery
): Promise<IDeviceData[]> {
  const client = await getDeviceConnection(deviceID, type);
  const {
    variables,
    qty,
    start_date,
    end_date,
    values,
    skip,
    ordination,
    groups,
    ids,
  } = query;

  const knexQuery = client
    .read("data")
    .select("*")
    .orderBy("time", ordination)
    .limit(qty);

  if (skip > 0) {
    knexQuery.offset(skip);
  }
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

  let rows: any[] = [];

  if (!variables || !variables.length) {
    rows = await knexQuery;
  } else {
    const queries: any[] = [];
    let limit = qty;

    if (variables.length * limit > 10000) {
      limit = Math.round(10000 / variables.length);
    }

    for (const variable of variables) {
      const queryIn = knexQuery.clone();
      queryIn.where("variable", variable);
      queryIn.limit(limit);
      queries.push(await queryIn);
    }

    rows = queries.flat();
  }

  for (const item of rows) {
    if (item.type === "number") {
      item.value = Number(item.value);
    } else if (item.type === "boolean") {
      item.value = String(item.value) === "true";
    } else if (item.type === "string") {
      item.value = String(item.value);
    }
  }

  return rows;
}

export default getDeviceDataDefaultQ;
