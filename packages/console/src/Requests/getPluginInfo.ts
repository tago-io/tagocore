import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function getPluginInfo(id: TGenericID) {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  const response = await axios.get(`/plugin/${id}/`, { headers });
  return response.data.result;
}

export default getPluginInfo;
