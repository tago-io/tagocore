/**
 * ## PORTS ##
 * -  10: Sensor data from the MCU, battery gauge and accelerometer
 * -  25: Report discovered BLE devices
 * - 100: Response to configuration and control commands
 */

function Decoder(bytes, port) {
  const decoded = [];
  if (port === 10) {
    for (let i = 0; i < bytes.length; ) {
      const channel = bytes[i++];
      const type = bytes[i++];

      // battery status - 1byte unsigned
      if (channel === 0x00 && type === 0xba) {
        const value = bytes.readUInt8(i++);
        decoded.push({ variable: "battery_status_life", value: 2.5 + (value & 0x7f) * 0.01, unit: "V" });
      }
      // acceleration alarm status - 1byte unsigned
      else if (channel === 0x00 && type === 0x00) {
        const value = bytes.readUInt8(i++);
        decoded.push({ variable: "acceleration_alarm", value: value === 0x00 ? 0 : 1 });
      }
      // acceleration vector = 6bytes signed
      else if (channel === 0x00 && type === 0x71) {
        const valuex = bytes.readInt16BE(i);
        i += 2;
        const valuey = bytes.readInt16BE(i);
        i += 2;
        const valuez = bytes.readInt16BE(i);
        i += 2;
        decoded.push({ variable: "acceleration_vector_xaxis", value: valuex * 0.001, unit: "g" });
        decoded.push({ variable: "acceleration_vector_yaxis", value: valuey * 0.001, unit: "g" });
        decoded.push({ variable: "acceleration_vector_zaxis", value: valuez * 0.001, unit: "g" });
      }
      // mcu temperature - 2b signed
      else if (channel === 0x00 && type === 0x67) {
        const value = bytes.readInt16BE(i);
        i += 2;
        decoded.push({ variable: "temperature", value: value * 0.1, unit: "°C" });
      }
    }
  } else if (port === 25) {
    const type = bytes[0];
    switch (type) {
      case 0x0a:
        decoded.push({ variable: "message_type", value: "basic mode" });
        for (let i = 1, j = 1; i < bytes.length; j++) {
          const bd_addr = bytes.readUIntBE(i, 6);
          i += 6;
          const rssi = bytes.readInt8(i++);
          decoded.push({ variable: `bd_addr${j}`, value: bd_addr.toString(16).toUpperCase().padStart(12, "0") });
          decoded.push({ variable: `rssi${j}`, value: rssi });
        }
        break;
      case 0xb0:
        decoded.push({ variable: "message_type", value: "whitelisting mode, range 0" });
        for (let i = 1, j = 1; i < bytes.length; j++) {
          const bd_addr_lap = bytes.readUIntBE(i, 3);
          i += 3;
          const rssi = bytes.readInt8(i++);
          decoded.push({ variable: `bd_addr_lap${j}`, value: bd_addr_lap.toString(16).toUpperCase().padStart(6, "0") });
          decoded.push({ variable: `rssi${j}`, value: rssi });
        }
        break;
      case 0xb1:
        decoded.push({ variable: "message_type", value: "whitelisting mode, range 1" });
        for (let i = 1, j = 1; i < bytes.length; j++) {
          const bd_addr_lap = bytes.readUIntBE(i, 3);
          i += 3;
          const rssi = bytes.readInt8(i++);
          decoded.push({ variable: `bd_addr_lap${j}`, value: bd_addr_lap.toString(16).toUpperCase().padStart(6, "0") });
          decoded.push({ variable: `rssi${j}`, value: rssi });
        }
        break;
      case 0xb2:
        decoded.push({ variable: "message_type", value: "whitelisting mode, range 2" });
        for (let i = 1, j = 1; i < bytes.length; j++) {
          const bd_addr_lap = bytes.readUIntBE(i, 3);
          i += 3;
          const rssi = bytes.readInt8(i++);
          decoded.push({ variable: `bd_addr_lap${j}`, value: bd_addr_lap.toString(16).toUpperCase().padStart(6, "0") });
          decoded.push({ variable: `rssi${j}`, value: rssi });
        }
        break;
      case 0xb3:
        decoded.push({ variable: "message_type", value: "whitelisting mode, range 3" });
        for (let i = 1, j = 1; i < bytes.length; j++) {
          const bd_addr_lap = bytes.readUIntBE(i, 3);
          i += 3;
          const rssi = bytes.readInt8(i++);
          decoded.push({ variable: `bd_addr_lap${j}`, value: bd_addr_lap.toString(16).toUpperCase().padStart(6, "0") });
          decoded.push({ variable: `rssi${j}`, value: rssi });
        }
        break;
      default:
        break;
    }
  }
  return decoded;
}

export default async function parserSafeAlert(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find((x) => x.variable === "payload" || x.variable === "payload_raw" || x.variable === "data");
  const port = payload.find((x) => x.variable === "port" || x.variable === "fport");

  if (data) {
    const serie = data.serie || new Date().getTime();
    const bytes = Buffer.from(data.value, "hex");
    payload = payload.concat(Decoder(bytes, Number(port.value))).map((x) => ({ ...x, serie }));
  }

  return payload;
}
