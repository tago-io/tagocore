import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

import store from "../System/Store.ts";

type TRestoreDeviceDataResponse =
  | {
      status: true;
      result: string;
    }
  | {
      status: false;
      error?: string;
    };

export async function restoreDeviceData(
  deviceID: TGenericID,
  options: { filePath: string },
) {
  const response = await axios.post<TRestoreDeviceDataResponse>(
    `/device/${deviceID}/data/restore`,
    { file: options.filePath },
    { headers: { token: store.token } },
  );

  return response.data;
}
