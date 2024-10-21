import type { IDatabaseCreateAnalysisData } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Creates a new analysis.
 */
async function createAnalysis(
  data: IDatabaseCreateAnalysisData,
): Promise<void> {
  const object = { ...data };

  if (object.variables) {
    object.variables = JSON.stringify(object.variables) as any;
  }
  if (object.tags) {
    object.tags = JSON.stringify(object.tags) as any;
  }

  await knexClient.insert(object).into("analysis");
}

export default createAnalysis;
