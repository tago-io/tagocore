import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function startPluginModule(id: TGenericID, moduleID: string) {
  const headers = { token: store.token };
  await axios.post(`/plugin/${id}/${moduleID}/start`, {}, { headers });
}

export default startPluginModule;
