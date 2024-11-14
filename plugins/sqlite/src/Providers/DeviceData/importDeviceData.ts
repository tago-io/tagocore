import fs from "node:fs";
import {
  type IDevice,
  type IDeviceChunkPeriod,
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

/**
 * Validates the time range for immutable data points.
 * Throws an error if something is wrong.
 */
function _validateImmutableTimeRange(device: IDevice, data: any) {
  if (device.chunk_period) {
    const dateRange = _isImmutableTimeOutOfRange(
      data.time,
      device.chunk_period,
      device.chunk_retention || 0,
    );

    if (!dateRange.isOk) {
      const title = `Time must be between ${dateRange.startDate} and ${dateRange.endDate}`;
      throw new Error(title);
    }

    return dateRange;
  }
}

function _isImmutableTimeOutOfRange(
  time: Date,
  period: IDeviceChunkPeriod,
  retention: number,
): any {
  const date = DateTime.fromJSDate(time);
  const startDate = DateTime.utc()
    .minus({ [period]: retention })
    .startOf(period);
  const endDate = DateTime.utc().plus({ day: 1 }).endOf("day");

  return {
    isOk: date >= startDate && date <= endDate,
    startDate: startDate.toJSDate(),
    endDate: endDate.toJSDate(),
  };
}

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
    const chunkTimestamp = _validateImmutableTimeRange(device, parsedData);
    parsedData.chunk_timestamp_start = chunkTimestamp.startDate;
    parsedData.chunk_timestamp_end = chunkTimestamp.endDate;
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
