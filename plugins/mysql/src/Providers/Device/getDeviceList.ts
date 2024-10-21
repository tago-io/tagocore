import type {
  IDatabaseDeviceListQuery,
  IDeviceList,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import applyQueryPagination from "../../Helpers/applyQueryPagination.ts";
import applyTagFilter from "../../Helpers/applyTagFilter.ts";
import replaceFilterWildCards from "../../Helpers/replaceFilterWildcards.ts";

/**
 * Retrieves a list of devices.
 */
async function getDeviceList(
  query: IDatabaseDeviceListQuery,
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
      (Array.isArray(filter.id) ? filter.id : [filter.id]) as string[],
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

  for (const item of response) {
    if ("active" in item) {
      item.active = Boolean(item.active);
    }
    if (item.tags) {
      item.tags = JSON.parse(JSON.stringify(item.tags));
    }
    if (item.encoder_stack) {
      item.encoder_stack = JSON.parse(item.encoder_stack);
    }
    if (item.last_input) {
      item.last_input = new Date(item.last_input);
    }
    if (item.last_output) {
      item.last_output = new Date(item.last_output);
    }
    if (item.updated_at) {
      item.updated_at = new Date(item.updated_at);
    }
    if (item.created_at) {
      item.created_at = new Date(item.created_at);
    }
  }

  return response;
}

export default getDeviceList;
