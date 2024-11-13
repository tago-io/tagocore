import fs from "node:fs";
import {
  type IDevice,
  type TDeviceType,
  type TGenericID,
  generateResourceID,
  zDeviceData,
  zDeviceImmutableData,
} from "@tago-io/tcore-sdk/types";
import { parse } from "csv";
import type { Knex } from "knex";
import { DateTime } from "luxon";
import { deviceDB } from "../../Database/index.ts";
import getDeviceInfo from "../Device/getDeviceInfo.ts";

/**
 * Gets the chunk timestamps for a date.
 */
function _getChunkTimestamp(date: Date, device: IDevice) {
  const dateJS = DateTime.fromJSDate(date).toUTC();

  if (!device?.chunk_period) {
    return null;
  }

  if (!dateJS.isValid) {
    throw "Invalid Database Chunk Address (date)";
  }

  const startDate = dateJS.startOf(device.chunk_period).toJSDate();
  const endDate = dateJS.endOf(device.chunk_period).toJSDate();

  return { startDate, endDate };
}

function _parseData(row: any, device: IDevice) {
  const parsedData: any = {
    id: generateResourceID(),
    variable: row.variable,
    type: row.type,
    value: !row.value ? undefined : row.value,
    unit: !row.unit ? undefined : row.unit,
    group: row.group,
    location: !row.location ? undefined : JSON.parse(row.location),
    metadata: !row.metadata ? undefined : JSON.parse(row.metadata),
    time: new Date(row.time),
    created_at: new Date(),
    chunk_timestamp_start: undefined,
    chunk_timestamp_end: undefined,
    serie: !row.serie ? undefined : row.serie,
  };

  let zodData: any;
  if (device.chunk_period) {
    const chunkTimestamp = _getChunkTimestamp(new Date(row.time), device);
    if (chunkTimestamp) {
      parsedData.chunk_timestamp_start = chunkTimestamp.startDate;
      parsedData.chunk_timestamp_end = chunkTimestamp.endDate;
    }
    zodData = zDeviceImmutableData.parse(parsedData);
  } else {
    zodData = zDeviceData.parse(parsedData);
  }

  return zodData;
}

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
    const data: any[] = [];
    fs.createReadStream(fileName)
      .pipe(parse({ columns: true, encoding: "utf8" }))
      .on("data", (row) => {
        const parsedData = _parseData(row, device);
        data.push(parsedData);

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
