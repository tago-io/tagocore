import type { IAnalysisLogList, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves a list of an analysis' logs.
 */
async function getAnalysisLogs(
  analysisID: TGenericID,
): Promise<IAnalysisLogList> {
  const response = await mainDB.read
    .select("*")
    .from("analysis_log")
    .where("analysis_id", analysisID)
    .orderBy("timestamp", "desc")
    .limit(100);

  return response;
}

export default getAnalysisLogs;
