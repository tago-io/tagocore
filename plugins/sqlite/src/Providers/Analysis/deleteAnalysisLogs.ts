import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Deletes all logs of an analysis.
 */
async function deleteAnalysisLogs(analysisID: TGenericID): Promise<void> {
  await knexClient
    .delete()
    .from("analysis_log")
    .where("analysis_id", analysisID);
}

export default deleteAnalysisLogs;
