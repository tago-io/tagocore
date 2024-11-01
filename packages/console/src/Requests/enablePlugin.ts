import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 */
async function enablePlugin(id: TGenericID) {
  await axios.post(
    `/plugin/${id}/enable`,
    {},
    { headers: { token: store.token } },
  );
}

export default enablePlugin;
