import type {
  IDatabaseGetDeviceDataQuery,
  IDeviceData,
} from "@tago-io/tcore-sdk/types";
import type { Knex } from "knex";

/**
 */
async function finishBucketDataQuery(
  client: Knex.QueryBuilder<any, any>,
  knex: Knex.QueryBuilder<any, any>,
  query: IDatabaseGetDeviceDataQuery,
): Promise<IDeviceData[]> {
  const { start_date, end_date, values, groups, ids } = query;
  let { variables } = query;

  const knexQuery = knex.select("*");

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

  if (!variables || variables?.length === 0) {
    variables = (await getVariables(client)).map((x) => x.variable);
  }

  const queries: any[] = [];

  for (const variable of variables || []) {
    const queryIn = knexQuery.clone();
    queryIn.where("variable", variable);
    queries.push(await queryIn);
  }

  const rows = queries.flat();

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

async function getVariables(client: Knex.QueryBuilder<any, any>) {
  const query = client.select("variable").groupBy("variable");

  return await query;
}

export default finishBucketDataQuery;
