import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import { Account } from "@tago-io/sdk";
import store from "../System/Store.ts";

/**
 * Retrieves all information of a single analysis.
 */
async function getAnalysisInfo(id: TGenericID): Promise<IAnalysis> {
  const account = new Account({ token: store.token });
  const analysis = await account.analysis.info(id);
  return analysis as unknown as IAnalysis;
}

export default getAnalysisInfo;
