import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the information of an analysis.
 */
async function getAnalysisInfo(
  analysisID: TGenericID,
): Promise<IAnalysis | null> {
  const response = await mainDB.read
    .select("*")
    .from("analysis")
    .where("id", analysisID)
    .first();

  return response;
}

export default getAnalysisInfo;
