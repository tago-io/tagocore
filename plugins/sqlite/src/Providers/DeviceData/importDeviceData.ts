import fs from "node:fs";
import {
  type TDeviceType,
  type TGenericID,
  generateResourceID,
} from "@tago-io/tcore-sdk/types";
import { parse } from "csv";
import type { Knex } from "knex";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

async function _insertData(client: Knex, data: any[]) {
  client
    .batchInsert("data", data, 1000)
    .then(() => {
      return;
    })
    .catch((error) => {
      console.log(error);
      Promise.reject(error);
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
      .pipe(parse({ columns: true, encoding: "utf8" }))
      .on("data", (row) => {
        row.id = generateResourceID();
        data.push(row);
        if (data.length === 1000) {
          _insertData(client, data);
          data.length = 0;
        }
      })
      .on("end", () => {
        if (data.length > 0) {
          _insertData(client, data);
        }
        resolve("Data imported successfully");
      })
      .on("error", (error) => {
        console.log(error);
        reject(error);
      });
  });
}

export default importDeviceData;
