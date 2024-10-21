import type {
  IDatabaseAddAnalysisLogData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Creates/adds a new log for an analysis.
 */
async function addAnalysisLog(
  analysisID: TGenericID,
  data: IDatabaseAddAnalysisLogData,
): Promise<void> {
  const object = { ...data, analysis_id: analysisID };
  await mainDB.write.insert(object).into("analysis_log");
}

export default addAnalysisLog;
