import axios from "axios";
import store from "../System/Store.ts";

export async function emptyDeviceData(deviceID: string) {
  await axios.post(
    `/device/${deviceID}/empty`,
    {},
    {
      headers: { token: store.token },
    },
  );
}
