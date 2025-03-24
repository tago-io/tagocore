import { Resources } from "@tago-io/sdk";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function deleteAnalysis(id: TGenericID): Promise<void> {
  const resources = new Resources({ token: store.token });

  await resources.analysis.delete(id);
}

export default deleteAnalysis;
