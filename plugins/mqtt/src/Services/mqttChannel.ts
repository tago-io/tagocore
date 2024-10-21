import type { TGenericID } from "@tago-io/tcore-sdk/types";

export default function mqttChannel(deviceID: TGenericID) {
  if (!deviceID) {
    throw "Missing fields device_id";
  }

  return `$mqtt/bucket/${deviceID}`;
}
