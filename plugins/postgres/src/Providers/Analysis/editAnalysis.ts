import type {
  IDatabaseEditAnalysisData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Edits an analysis.
 */
async function editAnalysis(
  analysisID: TGenericID,
  data: IDatabaseEditAnalysisData,
): Promise<void> {
  await mainDB.write.update(data).from("analysis").where("id", analysisID);
}

export default editAnalysis;
