import { Resources } from "@tago-io/sdk";
import type { AnalysisQuery } from "@tago-io/sdk/lib/types";
import type { IAnalysis } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function getAnalysisList(
  page: number,
  amount: number,
  filter: any,
): Promise<IAnalysis[]> {
  const query = {
    page,
    amount,
    filter: {
      active: filter.active ?? undefined,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: ["name", "active", "last_run", "created_at"],
  };

  const resources = new Resources({ token: store.token });
  const result = await resources.analysis.list(query as AnalysisQuery);

  return result as unknown as IAnalysis[];
}

export default getAnalysisList;
