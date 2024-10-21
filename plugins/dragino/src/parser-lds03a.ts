import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { type IToTagoObject, toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param cNum
 * @returns {cTime}
 */
function getzf(cNum: string) {
  if (Number.parseInt(cNum) < 10) cNum = `0${cNum}`;

  return cNum;
}

/**
 * @param str
 * @returns {cTime}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMyDate(str: string | number | any) {
  let cDate: any;
  if (str > 9999999999) cDate = new Date(Number.parseInt(str));
  else cDate = new Date(Number.parseInt(str) * 1000);

  const cYear = cDate.getFullYear();
  const cMonth = cDate.getMonth() + 1;
  const cDay = cDate.getDate();
  const cHour = cDate.getHours();
  const cMin = cDate.getMinutes();
  const cSen = cDate.getSeconds();
  const cTime = `${cYear}-${getzf(String(cMonth))}-${getzf(String(cDay))} ${getzf(String(cHour))}:${getzf(
    String(cMin),
  )}:${getzf(String(cSen))}`;

  return cTime;
}

/**
 * @param i
 * @param bytes
 * @returns {string}
 */
function datalog(i: number, bytes: Buffer) {
  const aa = bytes[0 + i] & 0x02 ? "TRUE" : "FALSE";
  const bb = bytes[0 + i] & 0x01 ? "OPEN" : "CLOSE";
  const cc = (
    (bytes[1 + i] << 16) |
    (bytes[2 + i] << 8) |
    bytes[3 + i]
  ).toString(10);
  const dd = (
    (bytes[4 + i] << 16) |
    (bytes[5 + i] << 8) |
    bytes[6 + i]
  ).toString(10);
  const ee = getMyDate(
    (
      (bytes[7 + i] << 24) |
      (bytes[8 + i] << 16) |
      (bytes[9 + i] << 8) |
      bytes[10 + i]
    ).toString(10),
  );
  let string = `[${aa},${bb},${cc},${dd},${ee}]`;
  string = string.concat(",");

  return string;
}

/**
 * @param bytes
 * @param number
 * @returns
 */
function Decoder(bytes: Buffer, port: number) {
  if (port === 0x02) {
    const alarm = bytes[0] & 0x02 ? "TRUE" : "FALSE";
    const doorOpenStatus = bytes[0] & 0x01 ? "OPEN" : "CLOSE";
    const openTimes = (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
    const openDuration = (bytes[4] << 16) | (bytes[5] << 8) | bytes[6];
    const dataTime = getMyDate(
      (
        (bytes[7] << 24) |
        (bytes[8] << 16) |
        (bytes[9] << 8) |
        bytes[10]
      ).toString(10),
    );

    if (bytes.length === 11) {
      return {
        ALARM: alarm,
        DOOR_OPEN_STATUS: doorOpenStatus,
        DOOR_OPEN_TIMES: openTimes,
        LAST_DOOR_OPEN_DURATION: openDuration,
        TIME: dataTime,
      };
    }
  } else if (port === 0x03) {
    let dataSum: any;
    for (let i = 0; i < bytes.length; i += 11) {
      const data = datalog(i, bytes);
      if (i === Number.parseInt("0")) {
        dataSum = data;
      } else {
        dataSum += data;
      }
    }
    return {
      DATALOG: dataSum,
    };
  } else if (port === 0x04) {
    const tdc = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];
    const disalarm = bytes[3] & 0x01;
    const keepStatus = bytes[4] & 0x01;
    const keepTime = (bytes[5] << 8) | bytes[6];

    return {
      TDC: tdc,
      DISALARM: disalarm,
      KEEP_STATUS: keepStatus,
      KEEP_TIME: keepTime,
    };
  } else if (port === 0x05) {
    let subBand: any;
    let freqBand: any;
    let sensor: any;
    if (bytes[0] === 0x0a) {
      sensor = "LDS03A";
    }

    if (bytes[4] === 0xff) subBand = "NULL";
    else subBand = bytes[4];

    if (bytes[3] === 0x01) freqBand = "EU868";
    else if (bytes[3] === 0x02) freqBand = "US915";
    else if (bytes[3] === 0x03) freqBand = "IN865";
    else if (bytes[3] === 0x04) freqBand = "AU915";
    else if (bytes[3] === 0x05) freqBand = "KZ865";
    else if (bytes[3] === 0x06) freqBand = "RU864";
    else if (bytes[3] === 0x07) freqBand = "AS923";
    else if (bytes[3] === 0x08) freqBand = "AS923_1";
    else if (bytes[3] === 0x09) freqBand = "AS923_2";
    else if (bytes[3] === 0x0a) freqBand = "AS923_3";
    else if (bytes[3] === 0x0b) freqBand = "CN470";
    else if (bytes[3] === 0x0c) freqBand = "EU433";
    else if (bytes[3] === 0x0d) freqBand = "KR920";
    else if (bytes[3] === 0x0e) freqBand = "MA869";

    const firmVer = `${bytes[1] & 0x0f}.${(bytes[2] >> 4) & 0x0f}.${bytes[2] & 0x0f}`;
    const bat = ((bytes[5] << 8) | bytes[6]) / 1000;

    return {
      SENSOR_MODEL: sensor,
      FIRMWARE_VERSION: firmVer,
      FREQUENCY_BAND: freqBand,
      SUB_BAND: subBand,
      BAT: bat,
    };
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLDS03A(
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
  const port = payload.find(
    (x) => x.variable === "port" || x.variable === "fport",
  )?.value;

  if (payloadRaw) {
    try {
      // Convert the data from Hex to Javascript Buffer.
      const buffer = Buffer.from(String(payloadRaw.value), "hex");
      const serie = new Date().getTime();
      const payloadAux = Decoder(buffer, Number(port));
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
