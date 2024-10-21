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
  const timestampEnd = new Date(query.date).getTime();
  const timestampStart = new Date("2001-01-01").getTime();
  const client = await getDeviceConnection(deviceID, type);
  const queryResult = client
    .delete()
    .from("data")
    .where("chunk_timestamp_end", "<", timestampEnd)
    .where("chunk_timestamp_end", ">", timestampStart);
  await queryResult;
}

export default applyDeviceDataRetention;
