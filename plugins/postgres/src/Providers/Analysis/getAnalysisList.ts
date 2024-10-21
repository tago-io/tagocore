import type {
  IAnalysisList,
  IDatabaseAnalysisListQuery,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import applyQueryPagination from "../../Helpers/applyQueryPagination.ts";
import applyTagFilter from "../../Helpers/applyTagFilter.ts";
import replaceFilterWildCards from "../../Helpers/replaceFilterWildcards.ts";

/**
 * Retrieves a list of analyses.
 */
async function getAnalysisList(
  query: IDatabaseAnalysisListQuery,
): Promise<IAnalysisList> {
  const { page, amount, orderBy, fields, filter } = query;
  const pagination = applyQueryPagination(page, amount);

  const knexQuery = mainDB.read
    .select(fields)
    .from("analysis")
    .offset(pagination.offset)
    .limit(pagination.limit)
    .orderBy(orderBy[0], orderBy[1]);

  applyTagFilter(knexQuery, filter, "analysis");

  if (filter.id) {
    knexQuery.whereIn(
      "id",
      (Array.isArray(filter.id) ? filter.id : [filter.id]) as string[],
    );
  }
  if (filter.name) {
    knexQuery.where("name", "like", replaceFilterWildCards(filter.name));
  }
  if (filter.binary_path) {
    knexQuery.where(
      "binary_path",
      "like",
      replaceFilterWildCards(filter.binary_path),
    );
  }
  if (filter.file_path) {
    knexQuery.where(
      "file_path",
      "like",
      replaceFilterWildCards(filter.file_path),
    );
  }
  if ("active" in filter) {
    knexQuery.where("active", filter.active);
  }

  const response = await knexQuery;

  return response;
}

export default getAnalysisList;
