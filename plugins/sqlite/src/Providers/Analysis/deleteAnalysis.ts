import { TGenericID } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex";

/**
 * Deletes an analysis.
 */
async function deleteAnalysis(analysisID: TGenericID): Promise<void> {
  await knexClient.delete().from("analysis").where("id", analysisID);
}

export default deleteAnalysis;
