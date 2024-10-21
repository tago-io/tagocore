import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { type IToTagoObject, toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param bytes
 * @returns
 */
function Decoder(bytes: Buffer) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  const value = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
  const bat = value / 1000;
  const waterLeakStatus = bytes[0] & 0x40 ? 1 : 0;
  const mod = bytes[2];

  const leakTimes = bytes[3] | bytes[4] | bytes[5];
  const leakDuration = bytes[6] | bytes[7] | bytes[8]; // units:min
  if (bytes.length === 10 && bytes[0] < 0x07 && 0x07 < 0x0f) {
    return [
      { variable: "bat_v", value: bat, unit: "v" },
      { variable: "mod", value: mod },
      { variable: "water_leak_status", value: waterLeakStatus },
      { variable: "water_leak_times", value: leakTimes },
      {
        variable: "last_water_leak_duration",
        value: leakDuration,
        unit: "min",
      },
    ];
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLWL02(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payloadRaw = payload.find(
    (x) =>
      x.variable === "payload_raw" ||
      x.variable === "payload" ||
      x.variable === "data",
  );

  if (payloadRaw) {
    try {
      // Convert the data from Hex to Javascript Buffer.
      const buffer = Buffer.from(String(payloadRaw.value), "hex");
      const serie = new Date().getTime();
      const payloadAux = Decoder(buffer);
      payload = payload
        .concat(toTagoFormat(payloadAux as unknown as IToTagoObject))
        .map((x) => ({ ...x, serie }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Print the error to the Live Inspector.
      console.error(e);
      // Return the variable parse_error for debugging.
      payload = [{ variable: "parse_error", value: e.message }];
    }
  }

  return payload;
}
