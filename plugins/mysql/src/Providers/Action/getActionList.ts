import type {
  IActionList,
  IDatabaseActionListQuery,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import applyQueryPagination from "../../Helpers/applyQueryPagination.ts";
import applyTagFilter from "../../Helpers/applyTagFilter.ts";
import replaceFilterWildCards from "../../Helpers/replaceFilterWildcards.ts";

/**
 * Retrieves a list of actions.
 */
async function getActionList(
  query: IDatabaseActionListQuery,
): Promise<IActionList> {
  const { page, amount, orderBy, fields, filter } = query;

  const pagination = applyQueryPagination(page, amount);

  const knexQuery = mainDB.read
    .select(fields)
    .from("action")
    .offset(pagination.offset)
    .limit(pagination.limit)
    .orderBy(orderBy[0], orderBy[1]);

  applyTagFilter(knexQuery, filter, "action");

  if (filter.id) {
    knexQuery.whereIn(
      "id",
      (Array.isArray(filter.id) ? filter.id : [filter.id]) as string[],
    );
  }
  if (filter.name) {
    knexQuery.where("name", "like", replaceFilterWildCards(filter.name));
  }
  if (filter.type) {
    knexQuery.where("type", filter.type);
  }
  if ("active" in filter) {
    knexQuery.where("active", filter.active);
  }

  const response = await knexQuery;

  for (const item of response) {
    if ("active" in item) {
      item.active = Boolean(item.active);
    }
    if ("lock" in item) {
      item.lock = Boolean(item.lock);
    }
    if (item.tags) {
      item.tags = JSON.parse(JSON.stringify(item.tags));
    }
    if (item.action) {
      item.action = JSON.parse(JSON.stringify(item.action));
    }
    if (item.trigger) {
      item.trigger = JSON.parse(JSON.stringify(item.trigger));
    }
    if (item.device_info) {
      item.device_info = JSON.parse(JSON.stringify(item.device_info));
    }
    if (item.last_triggered) {
      item.last_triggered = new Date(item.last_triggered);
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

export default getActionList;
