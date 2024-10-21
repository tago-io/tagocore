import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * Decode the payload.
 *
 * @param bytes - payload as buffer
 * @returns
 */
function Decoder(bytes: Buffer) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  const value = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
  const bat = value / 1000; // Battery,units:V

  const DOOR_OPEN_STATUS = bytes[0] & 0x80 ? 1 : 0; // 1:open,0:close
  const WATER_LEAK_STATUS = bytes[0] & 0x40 ? 1 : 0;

  const mod = bytes[2];

  if (mod === 1) {
    const DOOR_OPEN_TIMES = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
    const LAST_DOOR_OPEN_DURATION =
      (bytes[6] << 16) | (bytes[7] << 8) | bytes[8]; // units:min
    return {
      BAT_V: bat,
      MOD: mod,
      DOOR_OPEN_STATUS,
      DOOR_OPEN_TIMES,
      LAST_DOOR_OPEN_DURATION,
    };
  }
  if (mod === 2) {
    const WATER_LEAK_TIMES = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
    const LAST_WATER_LEAK_DURATION =
      (bytes[6] << 16) | (bytes[7] << 8) | bytes[8]; // units:min
    return {
      BAT_V: bat,
      MOD: mod,
      WATER_LEAK_STATUS,
      WATER_LEAK_TIMES,
      LAST_WATER_LEAK_DURATION,
    };
  }

  return {
    BAT_V: bat,
    MOD: mod,
  };
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLWL01(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  const payloadRaw = payload.find(
    (x) => x.variable === "payload" || x.variable === "data",
  );

  if (payloadRaw) {
    // Get a unique serie for the incoming data.
    const group = payloadRaw.group || String(new Date().getTime());
    let varsToTago: IDeviceDataCreate[] = [];
    // Parse the payload from your sensor to function parsePayload
    try {
      const decoded = Decoder(Buffer.from(String(payloadRaw.value), "hex"));
      varsToTago = varsToTago.concat(toTagoFormat(decoded, group));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Catch any error in the parse code and send to parse_error variable.
      varsToTago = varsToTago.concat({
        variable: "parse_error",
        value: e.message || e,
      });
    }

    payload = payload.concat(varsToTago);
  }

  payload = payload.filter((item) => {
    if (item.location && "lat" in item.location) {
      if (item.location.lat === 0 && item.location.lng === 0) {
        return false;
      }
    }
    return true;
  });

  return payload;
}
