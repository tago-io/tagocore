import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves all the information of an analysis.
 */
async function getAnalysisInfo(
  analysisID: TGenericID,
): Promise<IAnalysis | null> {
  const response = await knexClient
    .select()
    .select("*")
    .from("analysis")
    .where("id", analysisID)
    .first();

  if (response) {
    response.active = Boolean(response.active);
    response.created_at = new Date(response.created_at);
    response.tags = JSON.parse(response.tags);

    if (response.variables) {
      response.variables = JSON.parse(response.variables);
    }
    if (response.last_run) {
      response.last_run = new Date(response.last_run);
    }
    if (response.updated_at) {
      response.updated_at = new Date(response.updated_at);
    }
  }

  return response;
}

export default getAnalysisInfo;
