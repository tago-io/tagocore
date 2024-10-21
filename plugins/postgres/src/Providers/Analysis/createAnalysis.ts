import type { IDatabaseCreateAnalysisData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Creates a new analysis.
 */
async function createAnalysis(
  data: IDatabaseCreateAnalysisData,
): Promise<void> {
  await mainDB.write.insert(data).into("analysis");
}

export default createAnalysis;
