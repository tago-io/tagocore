import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Deletes an analysis.
 */
async function deleteAnalysis(analysisID: TGenericID): Promise<void> {
  await mainDB.write.delete().from("analysis").where("id", analysisID);
}

export default deleteAnalysis;
