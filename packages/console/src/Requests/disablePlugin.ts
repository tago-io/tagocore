import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function disablePlugin(id: TGenericID) {
  await axios.post(
    `/plugin/${id}/disable`,
    {},
    { headers: { token: store.token } },
  );
}

export default disablePlugin;
