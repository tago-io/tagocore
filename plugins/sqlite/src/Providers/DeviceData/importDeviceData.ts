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
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";
import { DateTime } from "luxon";
import getDeviceInfo from "../Device/getDeviceInfo.ts";

async function _insertData(client: Knex, data: any[]) {
  client
    .batchInsert("data", data, 1000)
    .then(() => {
      return;
    })
    .catch((error) => {
      Promise.reject(error);
    });
}

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

  // This is to fix json type in sqlite
  if (zodData.location){
    zodData.location = JSON.stringify(zodData.location);
  }

  if (zodData.metadata){
    zodData.metadata = JSON.stringify(zodData.metadata);
  }

  return zodData;
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
        reject(error);
      });
  });
}

export default importDeviceData;
