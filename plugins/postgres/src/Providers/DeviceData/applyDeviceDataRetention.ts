import type {
  IDeviceApplyDataRetentionQuery,
  TDeviceType,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { getDeviceConnection } from "../../Helpers/DeviceDatabase.ts";

/**
 * Applies data retention for a device by deleting all old data.
 */
async function applyDeviceDataRetention(
  deviceID: TGenericID,
  type: TDeviceType,
  query: IDeviceApplyDataRetentionQuery,
): Promise<void> {
  const client = await getDeviceConnection(deviceID, type);
  const queryResult = client
    .write("data")
    .delete()
    .where("chunk_timestamp_end", "<", query.date)
    .where("chunk_timestamp_end", ">", "2001-01-01");
  await queryResult;
}

export default applyDeviceDataRetention;
