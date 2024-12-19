import { Resources } from "@tago-io/sdk";
import type { AnalysisInfo } from "@tago-io/sdk/lib/types";
import type { IAnalysisEdit, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function editAnalysis(
  id: TGenericID,
  data: IAnalysisEdit,
): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.analysis.edit(id, data as Partial<AnalysisInfo>);
}

export default editAnalysis;
