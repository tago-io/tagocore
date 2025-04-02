import type { TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";

import store from "../System/Store.ts";

type TBackupDeviceDataResponse =
  | {
      status: true;
      result: string;
    }
  | {
      status: false;
      error?: string;
    };

export async function backupDeviceData(
  deviceID: TGenericID,
  options: { targetDirectory: string },
) {
  const response = await axios.post<TBackupDeviceDataResponse>(
    `/device/${deviceID}/data/backup`,
    { folder: options.targetDirectory },
    { headers: { token: store.token } },
  );

  return response.data;
}
