import { core, pluginStorage } from "@tago-io/tcore-sdk";
import type {
  IDeviceData,
  IDeviceDataQuery,
} from "@tago-io/tcore-sdk/Types";
import { getConfigValues } from "./index.ts";
import * as requests from "./requests.ts";

/**
 * Sends data to domo.
 */
export async function sendData() {
  if (!getConfigValues().enable_send_data) {
    return;
  }

  const lastSentTimestamp = await pluginStorage.get("last-sent-timestamp");
  if (!lastSentTimestamp) {
    await pluginStorage.set("last-sent-timestamp", Date.now());
  }

  const deviceData = await getDeviceData();
  const datasetID = await getDataSetID();

  const csv = deviceData
    .map(
      (item) =>
        `${item.variable},${item.value},${item.unit || ""},${item.time.getTime()}`,
    )
    .join("\n");

  if (deviceData.length > 0) {
    const maxTime =
      Math.max(...deviceData.map((item) => item.time.getTime())) + 1;
    await requests.appendToDataSet(datasetID, csv);
    await pluginStorage.set("last-sent-timestamp", maxTime);
    console.log(`Sent ${deviceData.length} data point(s) to Domo`);
  }

  return deviceData.length;
}

/**
 * Gets the dataset id in domo to insert data into.
 * If the dataset ID is invalid then a new dataset will be created.
 */
async function getDataSetID() {
  let datasetID = await pluginStorage.get("send-dataset-id");
  let invalid = false;
  if (!datasetID) {
    invalid = true;
  } else {
    await requests.getDataSetInfo(datasetID).catch(() => (invalid = true));
  }

  if (invalid) {
    console.log(
      "Dataset ID to send to is invalid, creating a new DataSet on Domo",
    );
    datasetID = await requests.createDataSet();
    await pluginStorage.set("send-dataset-id", datasetID);
  }

  return datasetID;
}

/**
 * Gets the device data from either a single device or multiple devices, based
 * on the configuration defined in the plugin settings page.
 */
async function getDeviceData() {
  const configValues = getConfigValues();
  const lastSentTimestamp =
    (await pluginStorage.get("last-sent-timestamp")) || Date.now();
  const query: IDeviceDataQuery = {
    qty: 10000,
    start_date: new Date(lastSentTimestamp),
  };

  let data: IDeviceData[] = [];

  if (configValues.send_data_type === "multiple") {
    // get data by tag key and tag value
    const key = configValues.send_data_tag_key;
    const value = configValues.send_data_tag_value;
    const devices = await core.getDeviceList({
      filter: { tags: [{ key, value }] },
    });
    for (const device of devices) {
      const dataAux = await core.getDeviceData(device.id, query);
      data = data.concat(dataAux);
    }
  } else {
    // get data by tag key and tag value
    const deviceID = configValues.send_data_device_id;
    data = await core.getDeviceData(deviceID, query);
  }

  return data;
}
