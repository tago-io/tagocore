import fs from "node:fs";
import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import { parse } from "csv";

async function _insertData(client: any, data: any[]) {
  return new Promise((resolve, reject) => {
    client.batchInsert("data", data, 1000)
      .catch((error) => {
        reject(error);
      });
  });
}

/**
 * Import a device data from CSV file.
 */
async function importDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  fileName: string,
): Promise<string> {
  const client = await getDeviceConnection(deviceID, type);
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    fs.createReadStream(fileName)
    .pipe(parse())
    .on("data", async (row) => {
      data.push(row);
      if (data.length === 1000) {
        await _insertData(client, data);
        data.length = 0;
      }
    })
    .on("end", async () => {
      if (data.length > 0) {
        await _insertData(client, data);
      }
      resolve("Data imported successfully");
    })
    .on("error", (error) => {
      reject(error);
    });
  });
}

export default importDeviceData;
