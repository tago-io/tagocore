import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function getPluginDatabaseInfo() {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  const response = await axios.get("/plugin/database", { headers });
  return response.data.result;
}

export default getPluginDatabaseInfo;
