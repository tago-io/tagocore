import type { IDatabaseCreateAnalysisData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

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

  await mainDB.write.insert(object).into("analysis");
}

export default createAnalysis;
