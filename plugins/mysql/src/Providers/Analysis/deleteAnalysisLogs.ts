import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Deletes all logs of an analysis.
 */
async function deleteAnalysisLogs(analysisID: TGenericID): Promise<void> {
  await mainDB.write
    .delete()
    .from("analysis_log")
    .where("analysis_id", analysisID);
}

export default deleteAnalysisLogs;
