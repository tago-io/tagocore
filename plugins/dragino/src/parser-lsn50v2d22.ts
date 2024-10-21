import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { type IToTagoObject, toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param bytes
 * @returns {decode}
 */
function Decoder(bytes: Buffer) {
  const mode = (bytes[6] & 0x7c) >> 2;

  const decode: { [key: string]: string | number } = {};
  const array = [];

  if (mode !== 2 && mode !== 31) {
    array.push((decode.BatV = ((bytes[0] << 8) | bytes[1]) / 1000));

    decode.TempC1 = Number.parseFloat(
      ((((bytes[2] << 24) >> 16) | bytes[3]) / 10).toFixed(2),
    );

    decode.ADC_CH0V = ((bytes[4] << 8) | bytes[5]) / 1000;

    decode.Digital_IStatus = bytes[6] & 0x02 ? "H" : "L";

    if (mode !== 6) {
      decode.EXTI_Trigger = bytes[6] & 0x01 ? "TRUE" : "FALSE";

      decode.Door_status = bytes[6] & 0x80 ? "CLOSE" : "OPEN";
    }
  }

  if (String(mode) === "0") {
    decode.Work_mode = "IIC";

    if (((bytes[9] << 8) | bytes[10]) === 0) {
      decode.Illum = ((bytes[7] << 24) >> 16) | bytes[8];
    } else {
      decode.TempC_SHT = Number.parseFloat(
        ((((bytes[7] << 24) >> 16) | bytes[8]) / 10).toFixed(2),
      );

      decode.Hum_SHT = Number.parseFloat(
        (((bytes[9] << 8) | bytes[10]) / 10).toFixed(1),
      );
    }
  } else if (String(mode) === "1") {
    decode.Work_mode = " Distance";

    decode.Distance_cm = Number.parseFloat(
      (((bytes[7] << 8) | bytes[8]) / 10).toFixed(1),
    );

    if (((bytes[9] << 8) | bytes[10]) !== 65535) {
      decode.Distance_signal_strength = Number.parseFloat(
        ((bytes[9] << 8) | bytes[10]).toFixed(0),
      );
    }
  } else if (String(mode) === "2") {
    decode.Work_mode = " 3ADC";

    decode.BatV = bytes[11] / 10;

    decode.ADC_CH0V = ((bytes[0] << 8) | bytes[1]) / 1000;

    decode.ADC_CH1V = ((bytes[2] << 8) | bytes[3]) / 1000;

    decode.ADC_CH4V = ((bytes[4] << 8) | bytes[5]) / 1000;

    decode.Digital_IStatus = bytes[6] & 0x02 ? "H" : "L";

    decode.EXTI_Trigger = bytes[6] & 0x01 ? "TRUE" : "FALSE";

    decode.Door_status = bytes[6] & 0x80 ? "CLOSE" : "OPEN";

    if (((bytes[9] << 8) | bytes[10]) === 0) {
      decode.Illum = ((bytes[7] << 24) >> 16) | bytes[8];
    } else {
      decode.TempC_SHT = Number.parseFloat(
        ((((bytes[7] << 24) >> 16) | bytes[8]) / 10).toFixed(2),
      );

      decode.Hum_SHT = Number.parseFloat(
        (((bytes[9] << 8) | bytes[10]) / 10).toFixed(1),
      );
    }
  } else if (String(mode) === "3") {
    decode.Work_mode = "3DS18B20";

    decode.TempC2 = Number.parseFloat(
      ((((bytes[7] << 24) >> 16) | bytes[8]) / 10).toFixed(2),
    );

    decode.TempC3 = Number.parseFloat(
      ((((bytes[9] << 24) >> 16) | bytes[10]) / 10).toFixed(1),
    );
  } else if (String(mode) === "4") {
    decode.Work_mode = "Weight";

    decode.Weight = ((bytes[7] << 24) >> 16) | bytes[8];
  } else if (String(mode) === "5") {
    decode.Work_mode = "Count";

    decode.Count =
      (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10];
  } else if (String(mode) === "31") {
    decode.Work_mode = "ALARM";

    decode.BatV = ((bytes[0] << 8) | bytes[1]) / 1000;

    decode.TempC1 = Number.parseFloat(
      ((((bytes[2] << 24) >> 16) | bytes[3]) / 10).toFixed(2),
    );

    decode.TempC1MIN = (bytes[4] << 24) >> 24;

    decode.TempC1MAX = (bytes[5] << 24) >> 24;

    decode.SHTEMPMIN = (bytes[7] << 24) >> 24;

    decode.SHTEMPMAX = (bytes[8] << 24) >> 24;

    // decode.SHTHUMMIN = bytes[9];

    // decode.SHTHUMMAX = bytes[10];
  }

  if (bytes.length === 11 || bytes.length === 12) {
    return decode;
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLSN50V2(
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
