import fs from "node:fs";
import { csvNameGenerator } from "@tago-io/tcore-sdk";
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
    const filename = `${folder}/${csvNameGenerator(`data_${deviceID}`)}`;
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
