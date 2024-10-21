import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function installPlugin(source: string): Promise<any> {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  const response = await axios.post("/install-plugin", { source }, { headers });
  const { data } = response;
  return data.result;
}

export default installPlugin;
