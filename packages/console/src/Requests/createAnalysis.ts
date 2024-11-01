import { Account } from "@tago-io/sdk";
import type { AnalysisCreateInfo } from "@tago-io/sdk/out/modules/Account/analysis.types";
import type { IAnalysisCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 */
async function createAnalysis(
  data: Omit<IAnalysisCreate, "id" | "created_at">,
): Promise<TGenericID> {
  const account = new Account({ token: store.token });
  const result = await account.analysis.create(data as AnalysisCreateInfo);
  return result.id;
}

export default createAnalysis;
