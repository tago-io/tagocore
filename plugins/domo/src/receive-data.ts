import { parseString } from "@fast-csv/parse";
import { core, pluginStorage } from "@tago-io/tcore-sdk";
import type { IDeviceData } from "@tago-io/tcore-sdk/Types";
import { getConfigValues } from "./index.ts";
import * as requests from "./requests.ts";

/**
 * Pulls data from a domo dataset and inserts data into a device.
 * Only new data in the dataset will be inserted into the device.
 */
export async function receiveData() {
  if (!getConfigValues().enable_receive_data) {
    return;
  }

  const deviceID = getConfigValues().receive_device_id;
  const datasetID = getConfigValues().receive_dataset_id;
  const datasetInfo = await requests
    .getDataSetInfo(datasetID)
    .catch(() => null);
  if (!datasetInfo) {
    throw new Error("Invalid receiving DataSet ID");
  }
  const deviceInfo = await core.getDeviceInfo(deviceID).catch(() => null);
  if (!deviceInfo) {
    throw new Error("Invalid receiving Device ID");
  }

  const datasetCSV = await requests.getDataFromDataSet(datasetID);
  const newDataPoints = await parseCSV(datasetCSV);

  if (newDataPoints.length > 0) {
    const maxTime = Math.max(
      ...newDataPoints.map((item) => item.time.getTime()),
    );
    await core.addDeviceData(deviceID, newDataPoints);
    await pluginStorage.set("last-receive-timestamp", maxTime);
    console.log(`Received ${newDataPoints.length} data point(s) from Domo`);
  }

  return newDataPoints.length;
}

/**
 * Parses the csv in the parameter and returns a device data array structure.
 */
async function parseCSV(csv: string): Promise<IDeviceData[]> {
  const lastReceiveTimestamp =
    (await pluginStorage.get("last-receive-timestamp")) || 0;
  const newDataPoints: IDeviceData[] = [];

  return await new Promise((resolve) => {
    parseString(csv, { headers: true })
      .on("data", (row: IDeviceData) => {
        if (typeof row.metadata === "string") {
          row.metadata = JSON.parse(row.metadata);
        }

        row.time = new Date(Number(row.time));

        if (lastReceiveTimestamp < row.time) {
          // only insert new data points
          newDataPoints.push(row);
        }
      })
      .on("end", () => {
        resolve(newDataPoints);
      });
  });
}
