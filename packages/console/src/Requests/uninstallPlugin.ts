import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function uninstallPlugin(id: TGenericID, keepData?: boolean) {
  const headers = { token: store.token };
  await axios.get(`/plugin-uninstall/${id}?keep_data=${keepData}`, { headers });
}

export default uninstallPlugin;
