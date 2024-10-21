import type {
  IDatabaseDeviceDataEdit,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Edits a device data point.
 */
async function editDeviceData(
  deviceID: TGenericID,
  type: TDeviceType,
  data: IDatabaseDeviceDataEdit[],
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);

  for (const item of data) {
    if (item.metadata) {
      item.metadata = JSON.stringify(item.metadata) as any;
    }
    if (item.location) {
      item.location = JSON.stringify(item.location) as any;
    }

    const query = client.write("data").update(item).where("id", item.id);

    await query;
  }
}

export default editDeviceData;
