import { Resources } from "@tago-io/sdk";
import type { AnalysisCreateInfo } from "@tago-io/sdk/lib/types";
import type { IAnalysisCreate, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function createAnalysis(
  data: Omit<IAnalysisCreate, "id" | "created_at">,
): Promise<TGenericID> {
  const resources = new Resources({ token: store.token });
  const result = await resources.analysis.create(data as AnalysisCreateInfo);

  return result.id;
}

export default createAnalysis;
