import fs from "node:fs";
import { csvNameGenerator } from "@tago-io/tcore-sdk";
import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { stringify } from "csv";
import { deviceDB } from "../../Database/index.ts";
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
    const filename = `${folder}/${csvNameGenerator(`data_${deviceID}`)}`;
    const file = fs.createWriteStream(filename);
    file.setDefaultEncoding("utf8");

    // TODO - Fix to use copy from postgres
    // const sqlCommand = `COPY "${deviceID}" TO STDOUT WITH CSV HEADER`;
    // const deviceDataStream = deviceDB.read.raw(sqlCommand).stream();
    const deviceDataStream = client.read("data")?.select("*").stream();
    if (!deviceDataStream) {
      return reject("No data to export");
    }

    deviceDataStream
      .pipe(stringify({ header: true }))
      .pipe(file)
      .on("finish", () => {
        resolve(filename);
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      });
  });
}

export default exportDeviceData;
