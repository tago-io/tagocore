import fs from "node:fs";
import { csvNameGenerator } from "@tago-io/tcore-sdk";
import type { TDeviceType, TGenericID } from "@tago-io/tcore-sdk/types";
import { stringify } from "csv";
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

  const filename = `${folder}/${csvNameGenerator(`data_${deviceID}`)}`;
  const file = fs.createWriteStream(filename);
  file.setDefaultEncoding("utf8");
  const columns = [
    "id",
    "variable",
    "type",
    "value",
    "unit",
    "group",
    "location",
    "metadata",
    "time",
    "created_at",
  ];

  const stringifier = stringify({
    header: true,
    columns,
  });

  stringifier.pipe(file);

  const deviceDataStream = client.select(columns).from("data").stream();

  if (!deviceDataStream) {
    return Promise.reject("No data to export");
  }

  for await (const row of deviceDataStream) {
    row.time = new Date(row.time).toISOString();
    row.created_at = new Date(row.created_at).toISOString();
    stringifier.write(row);
  }

  return Promise.resolve(filename);
}

export default exportDeviceData;
