import type {
  IDevice,
  IDeviceDataCreate,
} from "@tago-io/tcore-sdk/Types";
import { toTagoFormat } from "./lib/to-tago-format.ts";

declare const device: IDevice & {
  params: { key: string; value: string; sent: boolean }[];
};

/**
 * @param bytes
 * @param serie
 * @returns
 */
function Decoder13(bytes: Buffer, serie: number) {
  bytes = Buffer.from(bytes as unknown as string, "hex");
  let value = ((bytes[0] << 8) | bytes[1]) & 0x3fff;
  const batV = value / 1000; //Battery,units:V
  value = (bytes[2] << 8) | bytes[3];
  if (bytes[2] & 0x80) {
    value |= 0xffff0000;
  }
  const tempSHT = (value / 100).toFixed(2); //SHT20,temperature,units:℃

  value = (bytes[4] << 8) | bytes[5];
  const humSHT = (value / 10).toFixed(1); //SHT20,Humidity,units:%

  value = (bytes[7] << 8) | bytes[8];
  if (bytes[7] & 0x80) {
    value |= 0xffff0000;
  }
  const tempDs = (value / 100).toFixed(2); //DS18B20,temperature,units:℃

  return {
    battery: { value: Number(batV), serie, unit: "V" },
    temp_ds: { value: Number(tempDs), serie, unit: "°C" },
    temp_sht: { value: Number(tempSHT), serie, unit: "°C" },
    hum_sht: { value: Number(humSHT), serie, unit: "%" },
  };
}

/**
 * Decode data from Dragino sensor
 *
 * @param bytes
 * @param number
 * @returns {decoded}
 */
function Decoder18(bytes: Buffer, port: number) {
  const decoded: {
    variable: string;
    value: string | number | boolean;
    unit?: string;
  }[] = [];

  if (port !== 2) {
    return decoded;
  }

  const ext = bytes[6];
  let connected = false;

  if ((ext & 0x0f) !== 0x09) {
    // BAT-Battery Info (2 bytes)
    const value = bytes[0] >> 6;
    switch (value) {
      case 0b00:
        decoded.push({
          variable: "bat_status",
          value: "Ultra Low ( BAT <= 2.50v )",
        });
        break;
      case 0b01:
        decoded.push({
          variable: "bat_status",
          value: "Low ( 2.50v <= BAT <= 2.55v )",
        });
        break;
      case 0b10:
        decoded.push({
          variable: "bat_status",
          value: "OK ( 2.55v <= BAT <= 2.65v )",
        });
        break;
      case 0b11:
        decoded.push({
          variable: "bat_status",
          value: "Good ( BAT >= 2.65v )",
        });
        break;
      default:
        break;
    }
    decoded.push({
      variable: "battery",
      value: (((bytes[0] & 0x3f) << 8) | bytes[1]) / 1000,
      unit: "V",
    });
    // Built-In Temperature (2 bytes)
    decoded.push({
      variable: "temp_sht",
      value: (((bytes[2] << 24) >> 16) | bytes[3]) / 100,
      unit: "°C",
    });
    // Built-In Humidity (2 bytes)
    decoded.push({
      variable: "hum_sht",
      value: ((bytes[4] << 8) | bytes[5]) / 10,
      unit: "%",
    });
    // Ext (1 byte) & ext value (4 bytes)
    //const ext = bytes[6];
    switch (ext & 0x0f) {
      case 0x00:
        decoded.push({ variable: "ext_sensor", value: "No external sensor" });
        break;
      case 0x01:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E1, Temperature Sensor",
        });
        decoded.push({
          variable: "temp_ds",
          value: (((bytes[7] << 24) >> 16) | bytes[8]) / 100,
          unit: "°C",
        });
        break;
      case 0x04:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E4, Interrupt Sensor",
        });
        connected = bytes[6] >> 4 === 0;
        decoded.push({ variable: "cable_connected", value: connected });
        if (connected) {
          decoded.push({ variable: "pin_level", value: bytes[7] & 0x01 });
          decoded.push({
            variable: "interrupt_uplink",
            value: bytes[8] === 0x01,
          });
        }
        break;
      case 0x05:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E5, Illumination Sensor",
        });
        connected = bytes[6] >> 4 === 0;
        decoded.push({ variable: "cable_connected", value: connected });
        if (connected) {
          decoded.push({
            variable: "illumination",
            value: (bytes[7] << 8) | bytes[8],
            unit: "lux",
          });
        }
        break;
      case 0x06:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E6, ADC Sensor",
        });
        connected = bytes[6] >> 4 === 0;
        decoded.push({ variable: "cable_connected", value: connected });
        if (connected) {
          decoded.push({
            variable: "adc",
            value: ((bytes[7] << 8) | bytes[8]) / 1000,
            unit: "V",
          });
        }
        break;
      case 0x07:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E7, Counting Sensor, 16 bit",
        });
        connected = bytes[6] >> 4 === 0;
        decoded.push({ variable: "cable_connected", value: connected });
        if (connected) {
          decoded.push({
            variable: "count",
            value: (bytes[7] << 8) | bytes[8],
          });
        }
        break;
      case 0x08:
        decoded.push({
          variable: "ext_sensor",
          value: "Sensor E7, Counting Sensor, 32 bit",
        });
        connected = bytes[6] >> 4 === 0;
        decoded.push({ variable: "cable_connected", value: connected });
        if (connected) {
          decoded.push({
            variable: "count",
            value:
              (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10],
          });
        }
        break;
      default:
        break;
    }
  } else {
    decoded.push({
      variable: "ext_sensor",
      value: "Sensor E1, Temperature Sensor, Datalog Mod",
    });
    // External Temperature
    decoded.push({
      variable: "temp_ds",
      value: (((bytes[0] << 24) >> 16) | bytes[1]) / 100,
      unit: "°C",
    });
    // Built-In Temperature (2 bytes)
    decoded.push({
      variable: "temp_sht",
      value: (((bytes[2] << 24) >> 16) | bytes[3]) / 100,
      unit: "°C",
    });
    // BAT Status & Built-In Humidity (2 bytes)
    const value = bytes[4] >> 6;
    switch (value) {
      case 0b00:
        decoded.push({
          variable: "bat_status",
          value: "Ultra Low ( BAT <= 2.50v )",
        });
        break;
      case 0b01:
        decoded.push({
          variable: "bat_status",
          value: "Low ( 2.50v <= BAT <= 2.55v )",
        });
        break;
      case 0b10:
        decoded.push({
          variable: "bat_status",
          value: "OK ( 2.55v <= BAT <= 2.65v )",
        });
        break;
      case 0b11:
        decoded.push({
          variable: "bat_status",
          value: "Good ( BAT >= 2.65v )",
        });
        break;
      default:
        break;
    }
    decoded.push({
      variable: "hum_sht",
      value: (((bytes[4] & 0x0f) << 8) | bytes[5]) / 10,
      unit: "%",
    });
    // Status & Ext
    decoded.push({
      variable: "poll_message_flag",
      value: (bytes[6] >> 6) & 0x01,
    });
    decoded.push({ variable: "sync_time_ok", value: (bytes[6] >> 5) & 0x01 });
    decoded.push({
      variable: "unix_time_request",
      value: (bytes[6] >> 4) & 0x01,
    });
    // Unix Timestamp
    decoded.push({
      variable: "unix_timestamp",
      value: (bytes[7] << 24) | (bytes[8] << 16) | (bytes[9] << 8) | bytes[10],
    });
  }

  if (bytes.length === 11) {
    return decoded;
  }
}

/**
 * Decode data from Dragino sensor
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataCreate[]} data to be stored
 */
export default async function parserLHT65(
  payload: IDeviceDataCreate[],
): Promise<IDeviceDataCreate[]> {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find(
    (x) =>
      x.variable === "payload" ||
      x.variable === "payload_raw" ||
      x.variable === "data",
  );
  const port = payload.find(
    (x) => x.variable === "port" || x.variable === "fport",
  ); //uplink uses fport === 2
  const version = device.params.find(
    (x: { key: string }) => x.key.toLowerCase() === "version",
  );

  if (data) {
    const serie = data.serie || new Date().getTime();
    const bytes = Buffer.from(String(data.value), "hex");
    if (!version || !version.value || version.value === "1.8") {
      payload = payload
        .concat(
          Decoder18(bytes, Number(port?.value)) as unknown as IDeviceDataCreate,
        )
        .map((x) => ({ ...x, serie }));
    } else {
      payload = payload
        .concat(
          toTagoFormat(
            Decoder13(bytes, Number(port?.value)),
            String(Number(port?.value)),
          ),
        )
        .map((x) => ({ ...x, serie }));
    }
  }

  return payload;
}
