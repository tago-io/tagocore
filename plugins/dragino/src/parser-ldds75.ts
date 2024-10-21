import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param bytes
 * @returns
 */
function Decoder(bytes: Buffer) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  let value = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
  const batV = value / 1000; // Battery,units:V

  value = (bytes[2] << 8) | bytes[3];
  let distance = `${value} mm`; // distance,units:mm
  if (value === 0) distance = "No Sensor";
  else if (value < 280) distance = "Invalid Reading";

  return {
    Battery: { value: batV, unit: "V" },
    Distance: distance,
  };
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLDDS75(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payloadRaw = payload.find(
    (x) =>
      x.variable === "payload" ||
      x.variable === "payload_raw" ||
      x.variable === "data",
  );
  if (payloadRaw) {
    // Get a unique serie for the incoming data.
    const serie = payloadRaw.serie || new Date().getTime();
    let varsToTago: IDeviceDataCreate[] = [];
    // Parse the payload from your sensor to function parsePayload
    try {
      const decoded = Decoder(Buffer.from(String(payloadRaw.value), "hex"));
      varsToTago = varsToTago.concat(toTagoFormat(decoded, String(serie)));
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

  return payload;
}

// console.log(payload)
