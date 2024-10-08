import { IAnalysisLogList, TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex";

/**
 * Retrieves a list of an analysis' logs.
 */
async function getAnalysisLogs(analysisID: TGenericID): Promise<IAnalysisLogList> {
  const response = await knexClient
    .select("*")
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .orderBy("timestamp", "desc")
    .limit(100);

  for (const log of response) {
    log.error = Boolean(log.error);
    log.timestamp = new Date(log.timestamp);
  }

  return response;
}

export default getAnalysisLogs;
