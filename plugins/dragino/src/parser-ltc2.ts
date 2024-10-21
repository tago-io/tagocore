import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { type IToTagoObject, toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param bytes
 * @returns {decode}
 */
function Decoder(bytes: Buffer) {
  const pollMessageStatus = (bytes[2] & 0x40) >> 6;

  const decode: { [key: string]: string | number } = {};

  decode.Ext = bytes[2] & 0x0f;
  decode.BatV = (((bytes[0] << 8) | bytes[1]) & 0x3fff) / 1000;

  if (decode.Ext === 0x01) {
    decode.Temp_Channel1 = Number.parseFloat(
      ((((bytes[3] << 24) >> 16) | bytes[4]) / 100).toFixed(2),
    );
    decode.Temp_Channel2 = Number.parseFloat(
      ((((bytes[5] << 24) >> 16) | bytes[6]) / 100).toFixed(2),
    );
  } else if (decode.Ext === 0x02) {
    decode.Temp_Channel1 = Number.parseFloat(
      ((((bytes[3] << 24) >> 16) | bytes[4]) / 10).toFixed(1),
    );
    decode.Temp_Channel2 = Number.parseFloat(
      ((((bytes[5] << 24) >> 16) | bytes[6]) / 10).toFixed(1),
    );
  } else if (decode.Ext === 0x03) {
    decode.Res_Channel1 = Number.parseFloat(
      (((bytes[3] << 8) | bytes[4]) / 100).toFixed(2),
    );
    decode.Res_Channel2 = Number.parseFloat(
      (((bytes[5] << 8) | bytes[6]) / 100).toFixed(2),
    );
  }

  decode.Systimestamp =
    (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10];

  if (pollMessageStatus === 0) {
    if (bytes.length === 11) {
      return decode;
    }
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLTC2(
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
      payload = payload.concat(
        toTagoFormat(payloadAux as IToTagoObject).map((x) => ({ ...x, serie })),
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
