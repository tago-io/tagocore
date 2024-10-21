import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 * Deletes all logs of an analysis.
 */
async function deleteAnalysisLogs(id: TGenericID): Promise<void> {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  await axios.delete(`/analysis/${id}/log`, { headers });
}

export default deleteAnalysisLogs;
