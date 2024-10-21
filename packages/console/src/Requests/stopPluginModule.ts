import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function stopPluginModule(id: TGenericID, moduleID: any) {
  const headers = { token: store.token };
  await axios.post(`/plugin/${id}/${moduleID}/stop`, {}, { headers });
}

export default stopPluginModule;
