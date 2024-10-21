import type {
  IDatabaseAddAnalysisLogData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Creates/adds a new log for an analysis.
 */
async function addAnalysisLog(
  analysisID: TGenericID,
  data: IDatabaseAddAnalysisLogData,
): Promise<void> {
  const object = { ...data, analysis_id: analysisID };
  await knexClient.insert(object).into("analysis_log");
}

export default addAnalysisLog;
