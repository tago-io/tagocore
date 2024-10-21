import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { type IToTagoObject, toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param byte
 * @returns {zero}
 */
function strPad(byte: number) {
  const zero = "0";
  const hex = byte.toString(16);
  const tmp = 2 - hex.length;
  return zero.substr(0, tmp) + hex;
}

/**
 * @param bytes
 * @param port
 * @returns {decode}
 */
function Decoder(bytes: Buffer, port: number) {
  const decode: { [key: string]: string | number } = {};
  if (port === 2) {
    port;
    if (bytes.length === 11) {
      decode.TempC_SHT = Number.parseFloat(
        ((((bytes[0] << 24) >> 16) | bytes[1]) / 100).toFixed(2),
      );
      decode.Hum_SHT = Number.parseFloat(
        ((((bytes[2] << 24) >> 16) | bytes[3]) / 10).toFixed(1),
      );
      decode.TempC_DS = Number.parseFloat(
        ((((bytes[4] << 24) >> 16) | bytes[5]) / 100).toFixed(2),
      );

      decode.Ext = bytes[6];
      decode.Systimestamp =
        (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10];

      return decode;
    }
    decode.Status = "RPL data or sensor reset";

    return decode;
  }

  if (port === 3) {
    decode.Status =
      "Data retrieved, your need to parse it by the application server";

    return decode;
  }

  if (port === 4) {
    decode.DS18B20_ID =
      strPad(bytes[0]) +
      strPad(bytes[1]) +
      strPad(bytes[2]) +
      strPad(bytes[3]) +
      strPad(bytes[4]) +
      strPad(bytes[5]) +
      strPad(bytes[6]) +
      strPad(bytes[7]);

    return decode;
  }

  if (port === 5) {
    decode.Sensor_Model = bytes[0];
    decode.Firmware_Version = strPad((bytes[1] << 8) | bytes[2]);
    decode.Freq_Band = bytes[3];
    decode.Sub_Band = bytes[4];
    decode.Bat_mV = (bytes[5] << 8) | bytes[6];

    return decode;
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLHT52(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }
  const payloadRaw = payload.find(
    (x) => x.variable === "payload" || x.variable === "data",
  );
  const port = payload.find(
    (x) => x.variable === "port" || x.variable === "fport",
  )?.value;

  if (payloadRaw) {
    try {
      // Convert the data from Hex to Javascript Buffer.
      const buffer = Buffer.from(String(payloadRaw.value), "hex");
      const group = String(new Date().getTime());
      const payloadAux = Decoder(buffer, Number(port));
      payload = payload.concat(
        toTagoFormat(payloadAux as IToTagoObject).map((x) => ({ ...x, group })),
      );
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
