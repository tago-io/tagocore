import { Resources } from "@tago-io/sdk";
import type { IAnalysis, TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function getAnalysisInfo(id: TGenericID): Promise<IAnalysis> {
  const resources = new Resources({ token: store.token });
  const analysis = await resources.analysis.info(id);

  return analysis as unknown as IAnalysis;
}

export default getAnalysisInfo;
