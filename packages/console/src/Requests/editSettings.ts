import type { ISettings } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function editSettings(data: Partial<ISettings>): Promise<void> {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  await axios.put("/settings", data, { headers });
}

export default editSettings;
