import {
  IDatabaseDeviceListQuery,
  IDeviceList,
} from "@tago-io/tcore-sdk/types";
import applyQueryPagination from "../../Helpers/applyQueryPagination";
import replaceFilterWildCards from "../../Helpers/replaceFilterWildcards";
import applyTagFilter from "../../Helpers/applyTagFilter";
import { mainDB } from "../../Database";

/**
 * Retrieves a list of devices.
 */
async function getDeviceList(
  query: IDatabaseDeviceListQuery
): Promise<IDeviceList> {
  const { page, amount, orderBy, fields, filter } = query;
  const pagination = applyQueryPagination(page, amount);

  const knexQuery = mainDB.write
    .select()
    .from("device")
    .offset(pagination.offset)
    .limit(pagination.limit)
    .orderBy(`device.${orderBy[0]}`, orderBy[1]);

  applyTagFilter(knexQuery, filter, "device");

  for (const field of fields) {
    knexQuery.select(`device.${field}`);
  }

  if (filter.id) {
    knexQuery.whereIn(
      "device.id",
      (Array.isArray(filter.id) ? filter.id : [filter.id]) as string[]
    );
  }
  if (filter.name) {
    knexQuery.where("device.name", "like", replaceFilterWildCards(filter.name));
  }
  if ("active" in filter) {
    knexQuery.where("device.active", filter.active);
  }
  if ("type" in filter) {
    knexQuery.where("device.type", filter.type);
  }
  if ("last_retention" in filter) {
    knexQuery.where((q) => {
      q.where("last_retention", "<", filter.last_retention);
      q.orWhereNull("last_retention");
    });
  }

  const response = await knexQuery;

  return response;
}

export default getDeviceList;
