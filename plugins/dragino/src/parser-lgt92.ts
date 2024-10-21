import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { toTagoFormat } from "./lib/to-tago-format.ts";

/**
 * @param bytes
 * @returns {decoded}
 */
function Decoder16(bytes: Buffer) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.

  const latitude =
    ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) /
    1000000; //gps latitude,units: °

  const longitude =
    ((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7]) /
    1000000; //gps longitude,units: °

  const alarm = bytes[8] & 0x40 ? "TRUE" : "FALSE"; //Alarm status

  const batV = (((bytes[8] & 0x3f) << 8) | bytes[9]) / 1000; //Battery,units:V

  let md = "";

  //mode of motion
  const mode = bytes[10] >> 6;
  if (mode === 0x00) {
    md = "Disable";
  } else if (mode === 0x01) {
    md = "Move";
  } else if (mode === 0x02) {
    md = "Collide";
  } else if (mode === 0x03) {
    md = "Custom";
  }

  const ledUpdown = bytes[10] & 0x20 ? "ON" : "OFF"; //LED status for position,uplink and downlink

  const Firmware = 160 + (bytes[10] & 0x1f); // Firmware version; 5 bits

  const roll = ((bytes[11] << 8) | bytes[12]) / 100; //roll,units: °

  const pitch = ((bytes[13] << 8) | bytes[14]) / 100; //pitch,units: °

  let hdop = 0;
  if (bytes[15] > 0) {
    hdop = bytes[15] / 100; //hdop,units: °
  } else {
    hdop = bytes[15];
  }

  const altitude = ((bytes[16] << 8) | bytes[17]) / 100; //Altitude,units: °

  const decoded: { [key: string]: string | number | unknown } = {
    lat: latitude,
    lng: longitude,
    roll: roll,
    pitch: pitch,
    batv: batV,
    alarm_status: alarm,
    md: md,
    lon: ledUpdown,
    fw: Firmware,
    hdop: hdop,
    altitude: altitude,
  };

  if (decoded.lat && decoded.lng) {
    decoded.location = {
      value: `${decoded.lat},${decoded.lng}`,
      location: { lat: decoded.lat, lng: decoded.lng },
    };
    decoded.lat = undefined;
    decoded.lng = undefined;
  }

  return decoded;
}

/**
 * @param bytes
 * @returns {data}
 */
function Decoder15(bytes: Buffer) {
  const data: { [key: string]: string | number | unknown } = {
    // GPS coordinates; signed 32 bits integer, MSB; unit: Â°
    // When power is low (<2.84v), GPS wonâ€™t be able to get location
    // info and GPS feature will be disabled and the location field
    // will be filled with 0x0FFFFFFF, 0x0FFFFFFF.

    lat:
      ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) /
      1000000,

    lng:
      ((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7]) /
      1000000,

    // Alarm status: boolean
    alarm_status: (bytes[8] & 0x40) > 0,

    // Battery; 14 bits; unit: V
    batv: (((bytes[8] & 0x3f) << 8) | bytes[9]) / 1000,

    // Motion detection mode; 2 bits
    md: {
      0: "Disable",
      1: "Move",
      2: "Collide",
      3: "Custom",
    }[bytes[10] >> 6],

    // LED status for position, uplink and downlink; 1 bit
    lon: bytes[10] & 0x20 ? "ON" : "OFF",

    // Firmware version; 5 bits
    fw: 150 + (bytes[10] & 0x1f),

    // Roll; signed 16 bits integer, MSB; unit: Â°

    // Sign-extend to 32 bits to support negative values: shift 16 bytes

    // too far to the left, followed by sign-propagating right shift

    roll: (((bytes[11] << 24) >> 16) | bytes[12]) / 100,

    // Pitch: signed 16 bits integer, MSB, unit: Â°

    pitch: (((bytes[13] << 24) >> 16) | bytes[14]) / 100,
  };

  data.location = {
    value: `${data.lat},${data.lng}`,
    location: { lng: data.lng, lat: data.lat },
  };
  data.lng = undefined;
  data.lat = undefined;

  return data;
}

/**
 * @param bytes
 * @returns {json}
 */
function Decoder14(bytes: Buffer | number[]) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  const alarm = !!(bytes[6] & 0x40); // Alarm status
  let value: number;
  value = ((bytes[6] & 0x3f) << 8) | bytes[7];
  const battery = value / 1000; // Battery,units:Volts
  value = (bytes[8] << 8) | bytes[9];
  if (bytes[8] & 0x80) {
    value |= 0xffff0000;
  }
  const roll = value / 100; // roll,units: °
  value = (bytes[10] << 8) | bytes[11];
  if (bytes[10] & 0x80) {
    value |= 0xffff0000;
  }
  const pitch = value / 100; // pitch,units: °
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = {
    roll,
    pitch,
    battery,
    alarm,
  };
  value = (bytes[0] << 16) | (bytes[1] << 8) | bytes[2];
  if (bytes[0] & 0x80) {
    value |= 0xffffff000000;
  }
  let value2 = (bytes[3] << 16) | (bytes[4] << 8) | bytes[5];
  if (bytes[3] & 0x80) {
    value2 |= 0xffffff000000;
  }
  if (value === 0x0fffff && value2 === 0x0fffff) {
    // gps disabled (low battery)
  } else if (value === 0 && value2 === 0) {
    // gps no position yet
  } else {
    const lat = value / 10000; // gps latitude,units: °
    const lng = value2 / 10000; // gps longitude,units: °
    json.location = { value: `${lat},${lng}`, location: { lat, lng } };
  }
  return json;
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLGT92(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payloadRaw = payload.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (x: any) =>
      x.variable === "payload" ||
      x.variable === "payload_raw" ||
      x.variable === "data" ||
      x.variable === "frm_payload",
  );

  const device = { params: [{ key: "firmware_version", value: "1.6" }] };

  if (payloadRaw) {
    // Get a unique serie for the incoming data.
    const serie = payloadRaw.serie || new Date().getTime();

    let varsToTago: IDeviceDataCreate[] = [];

    // Parse the payload from your sensor to function parsePayload
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firmwareVersion = device.params.find(
        (param: any) => param.key === "firmware_version",
      );

      let decoded = {};
      if (firmwareVersion?.value === "1.4") {
        decoded = Decoder14(Buffer.from(String(payloadRaw.value), "hex"));
      } else if (firmwareVersion?.value === "1.5") {
        decoded = Decoder15(Buffer.from(String(payloadRaw.value), "hex"));
      } else {
        decoded = Decoder16(Buffer.from(String(payloadRaw.value), "hex"));
      }

      varsToTago = varsToTago.concat(toTagoFormat(decoded, String(serie)));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // Catch any error in the parse code and send to parse_error variable.
      varsToTago = varsToTago.concat({
        variable: "parse_error",
        value: e.message || e,
      });
    }

    if (payload.find((x) => x.variable === "frm_payload")) {
      payload = payload.filter((x) => {
        if (
          (x.location && String(x?.value).includes("undefined")) ||
          x.value === undefined ||
          x.value === null
        ) {
          return false;
        }
        return true;
      });
      const keys: string[] = [];
      for (const key in payload) {
        keys.push(payload[key].variable);
      }
      varsToTago = varsToTago.filter((y) => {
        if (
          keys.includes(y.variable) ||
          y.value === undefined ||
          y.value === null
        ) {
          return false;
        }
        return true;
      });
    }
    payload = payload.concat(varsToTago);
  }
  payload = payload.filter((item) => {
    if (item.variable === "lat") {
      if (item.value === 0) {
        console.error("Variable lat is ignored");
        return false;
      }
    }
    if (item.variable === "lng") {
      if (item.value === 0) {
        console.error("Variable lng is ignored");
        return false;
      }
    }
    return true;
  });

  payload = payload.filter((item) => {
    if (item.location) {
      if (
        "lat" in item.location &&
        item.location.lat === 0 &&
        item.location.lng === 0
      ) {
        console.error("Variable Location is ignored");
        return false;
      }
    }
    return true;
  });

  return payload;
}
