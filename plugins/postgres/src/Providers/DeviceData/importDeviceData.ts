import fs from "node:fs";
import {
  type IDevice,
  type TDeviceType,
  type TGenericID,
  generateResourceID,
} from "@tago-io/tcore-sdk/types";
import { parse } from "csv";
import type { Knex } from "knex";
import { DateTime } from "luxon";
import { deviceDB } from "../../Database/index.ts";
import getDeviceInfo from "../Device/getDeviceInfo.ts";

async function _insertData(client: Knex, data: any[], deviceID: TGenericID) {
  client
    .batchInsert(deviceID, data, 1000)
    .then(() => {
      return;
    })
    .catch((error) => {
      throw error;
    });
}

/**
 * Gets the chunk timestamps for a date.
 */
function getChunkTimestamp(date: Date, device: IDevice) {
  const dateJS = DateTime.fromJSDate(date).toUTC();

  if (!device?.chunk_period) {
    // pre 0.6.0 devices or immutable devices don't have chunk_period
    return null;
  }

  if (!dateJS.isValid) {
    throw "Invalid Database Chunk Address (date)";
  }

  const startDate = dateJS.startOf(device.chunk_period).toJSDate();
  const endDate = dateJS.endOf(device.chunk_period).toJSDate();

  return { startDate, endDate };
}

/**
 * Import a device data from CSV file.
 */
async function importDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  fileName: string,
): Promise<string> {
  const device = await getDeviceInfo(deviceID);
  if (!device) {
    throw new Error("Device not found");
  }
  return new Promise((resolve, reject) => {
    // TODO - Fix to use copy from postgres
    // const sqlCommand = `COPY "${deviceID}" FROM '${fileName}' DELIMITER ',' CSV HEADER`;
    // deviceDB.write.raw(sqlCommand).then(() => {
    //   resolve("Data imported successfully");
    // }).catch((error) => {
    //   console.log(error);
    //   reject(error);
    // });

    const data: any[] = [];
    fs.createReadStream(fileName)
      .pipe(parse({ columns: true, encoding: "utf8" }))
      .on("data", (row) => {
        row.id = generateResourceID();

        const chunkTimestamp = getChunkTimestamp(
          new Date(row.time - 1),
          device,
        );
        row.chunk_timestamp_end = chunkTimestamp?.endDate.toISOString();
        row.chunk_timestamp_start = chunkTimestamp?.startDate.toISOString();
        row.time = new Date(row.time - 1);
        row.created_at = new Date(row.created_at - 1);

        if (row.location) {
          row.location = JSON.parse(row.location);
        } else {
          row.location = null;
        }

        if (row.metadata) {
          row.metadata = JSON.parse(row.metadata);
        } else {
          row.metadata = null;
        }

        if (!row.value) {
          row.value = null;
        }

        if (!row.unit) {
          row.unit = null;
        }

        if (!row.serie) {
          row.serie = null;
        }

        data.push(row);
        if (data.length === 1000) {
          _insertData(deviceDB.write, data, deviceID);
          data.length = 0;
        }
      })
      .on("end", () => {
        if (data.length > 0) {
          _insertData(deviceDB.write, data, deviceID);
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
