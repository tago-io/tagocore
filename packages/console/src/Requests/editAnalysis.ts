import { Account } from "@tago-io/sdk";
import type { AnalysisInfo } from "@tago-io/sdk/out/modules/Account/analysis.types";
import type { IAnalysisEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function editAnalysis(
  id: TGenericID,
  data: IAnalysisEdit,
): Promise<void> {
  const account = new Account({ token: store.token });
  await account.analysis.edit(id, data as Partial<AnalysisInfo>);
}

export default editAnalysis;
