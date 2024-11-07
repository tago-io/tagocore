import fs from "node:fs";
import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { stringify } from "csv";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Export a device data to a CSV file.
 */
async function exportDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  folder: string,
): Promise<string> {
  const client = await getDeviceConnection(deviceID, type);
  return new Promise((resolve, reject) => {
    const deviceDataStream = client.select("*").from("data").stream();
    const date = new Date();
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    const year = date.getFullYear().toString();
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    const second = date.getSeconds().toString();
    const name = `${year}-${month}-${day}_${hour}-${minute}-${second}`;

    const filename = `${folder}/data_${deviceID}_${name}.csv`;
    const file = fs.createWriteStream(filename);
    file.setDefaultEncoding("utf8");

    deviceDataStream
      .pipe(stringify({ header: true }))
      .pipe(file)
      .on("finish", () => {
        resolve(filename);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

export default exportDeviceData;
