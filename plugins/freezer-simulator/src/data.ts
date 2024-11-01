import fs from "node:fs";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { core } from "@tago-io/tcore-sdk";
import type { IDevice, IDeviceDataCreate } from "@tago-io/tcore-sdk/types";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const dirname__ = dirname(__filename);

/**
 * Simulated data inside the .csv file.
 */
interface ICsvData {
  compressor_1: string;
  compressor_2: string;
  door_1: string;
  door_2: string;
  temperature_1: number;
  temperature_2: number;
}

let interval: any;
let csvIndex = 0;
let csvData: ICsvData[] = [];

/**
 * Loads the CSV data to memory.
 */
async function loadCsvData() {
  return new Promise((resolve) => {
    csvData = [];
    const filePath = path.join(dirname__, "../assets/data.csv");

    // read file csv
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => csvData.push(data))
      .on("end", resolve);
  });
}

/**
 * Sends data as the freezer.
 */
async function sendData(
  device: IDevice,
  freezerType: string,
  temperatureUnit: string,
) {
  if (csvIndex === csvData.length) {
    csvIndex = 0;
  }

  let data: IDeviceDataCreate[] = [];

  if (freezerType === "freezer_1") {
    // freezer 1
    data = [
      {
        variable: "internal_temperature",
        value: Number(csvData[csvIndex].temperature_1),
        unit: temperatureUnit,
      },
      {
        variable: "door_status",
        value: csvData[csvIndex].door_1,
      },
      {
        variable: "compressor_status",
        value: csvData[csvIndex].compressor_1,
      },
    ];
  } else {
    // freezer 2
    data = [
      {
        variable: "internal_temperature",
        value: Number(csvData[csvIndex].temperature_2),
        unit: temperatureUnit,
      },
      {
        variable: "door_status",
        value: csvData[csvIndex].door_2,
      },
      {
        variable: "compressor_status",
        value: csvData[csvIndex].compressor_2,
      },
    ];
  }

  console.log(
    `Sending simulated Freezer data for device "${device.name}": (${data[0].value}, ${data[1].value}, ${data[2].value})`,
  );

  try {
    await core.addDeviceData(device.id, data);
  } catch (ex: any) {
    const message = ex?.message || ex?.toString?.();
    console.error("Error while inserting data:", message);
  }

  csvIndex++;
}

/**
 * Starts sending data.
 *
 * This function populates the CSV data if it's not yet loaded, fetches the device, and
 * creates an interval with the desired frequency to keep sending data.
 */
export async function startSendingData(
  id: string,
  freezerType: string,
  temperatureUnit: string,
  frequency: number,
) {
  if (csvData.length === 0) {
    await loadCsvData();
  }

  const device = await core.getDeviceInfo(id);
  if (!device.active) {
    throw new Error("Device is not active");
  }

  clearInterval(interval);

  interval = setInterval(() => {
    sendData(device, freezerType, temperatureUnit);
  }, frequency);
}

/**
 * Stops the interval that sends data.
 */
export function stopSendingData() {
  clearInterval(interval);
}
