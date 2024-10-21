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
  const object = { ...data };

  if (object.variables) {
    object.variables = JSON.stringify(object.variables) as any;
  }
  if (object.tags) {
    object.tags = JSON.stringify(object.tags) as any;
  }

  await mainDB.write.update(object).from("analysis").where("id", analysisID);
}

export default editAnalysis;
