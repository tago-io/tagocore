import {
  type IAnalysis,
  type IAnalysisCreate,
  type IAnalysisEdit,
  type IAnalysisList,
  type IAnalysisListQuery,
  type ILog,
  type ILogCreate,
  type TGenericID,
  zAnalysis,
  zAnalysisCreate,
  zAnalysisEdit,
  zAnalysisList,
  zAnalysisListQuery,
  zLog,
  zLogCreate,
} from "@tago-io/tcore-sdk/types";
import { z } from "zod";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";

/**
 * Retrieves the stored analysis, throws an error if it doesn't exist.
 */
async function findAnalysis(id: TGenericID): Promise<IAnalysis> {
  const analysis = await invokeDatabaseFunction("getAnalysisInfo", id);
  if (!analysis) {
    throw new Error("Invalid Analysis ID");
  }
  return analysis;
}

/**
 * Validates an analysis ID, throws an error if it doesn't exist.
 */
export async function validateAnalysisID(id: TGenericID): Promise<void> {
  await findAnalysis(id);
}

/**
 * Creates/adds a new log for an analysis.
 */
export async function addAnalysisLog(analysisID: TGenericID, data: ILogCreate) {
  const parsed = await zLogCreate.parseAsync(data);
  return invokeDatabaseFunction("addAnalysisLog", analysisID, parsed);
}

/**
 * Retrieves all the logs of an analysis.
 */
export async function getAnalysisLogs(analysisID: TGenericID): Promise<ILog[]> {
  const response = await invokeDatabaseFunction("getAnalysisLogs", analysisID);
  const parsed = await z.array(zLog).parseAsync(response);
  return parsed;
}

/**
 * Lists all the analyses.
 */
export async function getAnalysisList(
  query: IAnalysisListQuery,
): Promise<IAnalysisList> {
  const params = await zAnalysisListQuery.parseAsync(query);
  const response = await invokeDatabaseFunction("getAnalysisList", params);
  const parsed = await zAnalysisList.parseAsync(response);
  return parsed;
}

/**
 * Fields of an analysis needed to run its script.
 */
const zAnalysisRunInfo = zAnalysis.pick({
  active: true,
  binary_path: true,
  file_path: true,
  id: true,
  variables: true,
});

export type IAnalysisRunInfo = z.infer<typeof zAnalysisRunInfo>;

/**
 * Retrieves the fields needed to run an analysis, without loading its logs.
 */
export async function getAnalysisRunInfo(
  id: TGenericID,
): Promise<IAnalysisRunInfo> {
  const analysis = await findAnalysis(id);
  const parsed = await zAnalysisRunInfo.parseAsync(analysis);
  return parsed;
}

/**
 * Retrieves all the information of a single analysis.
 */
export async function getAnalysisInfo(id: TGenericID): Promise<IAnalysis> {
  const analysis = await findAnalysis(id);
  const logs = await getAnalysisLogs(id);
  const parsed = await zAnalysis.parseAsync({ ...analysis, console: logs });
  return parsed;
}

/**
 * Edits a single analysis.
 */
export async function editAnalysis(
  id: TGenericID,
  analysis: IAnalysisEdit,
): Promise<void> {
  await validateAnalysisID(id);
  const parsed = await zAnalysisEdit.parseAsync(analysis);
  await invokeDatabaseFunction("editAnalysis", id, parsed);
}

/**
 * Deletes a single analysis.
 */
export async function deleteAnalysis(id: TGenericID): Promise<void> {
  await validateAnalysisID(id);
  await invokeDatabaseFunction("deleteAnalysis", id);
}

/**
 * Deletes all logs of an analysis.
 */
export async function deleteAnalysisLogs(id: TGenericID): Promise<void> {
  await validateAnalysisID(id);
  await invokeDatabaseFunction("deleteAnalysisLogs", id);
}

/**
 * Creates a new analysis.
 */
export async function createAnalysis(
  analysis: IAnalysisCreate,
): Promise<TGenericID> {
  const parsed = await zAnalysisCreate.parseAsync(analysis);
  await invokeDatabaseFunction("createAnalysis", parsed);
  return parsed.id;
}
