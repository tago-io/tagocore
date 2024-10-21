/* eslint-disable no-plusplus */
const ignore_vars = [];

/**
 * This is the main function to parse the payload. Everything else doesn't require your attention.
 * @param {String} payload_raw
 * @returns {Object} containing key and value to TagoIO
 */
function parsePayload(payload_raw) {
  try {
    // If your device is sending something different than hex, like base64, just specify it bellow.
    const buffer = Buffer.from(payload_raw, "hex");

    const data = [];
    for (let i = 0; i < buffer.length; ) {
      const channel = buffer[i++];
      const type = buffer[i++];

      // battery voltage
      if (channel === 0x00 && type === 0xff) {
        data.push({ variable: "battery_voltage", value: buffer.readInt16BE(i) * 0.01, unit: "V" });
        i += 2;
      }
      // Output 1
      else if (channel === 0x01 && type === 0x01) {
        const value = buffer[i++];
        if (value !== 0x00 && value !== 0xff) {
          return [{ variable: "parser_error", value: "Parser Error: Output 1 value must be 0x00 or 0xFF" }];
        }
        data.push({ variable: "output_1", value: value === 0xff ? "Closed" : "Opened" });
      }
      // Output 2
      else if (channel === 0x02 && type === 0x01) {
        const value = buffer[i++];
        if (value !== 0x00 && value !== 0xff) {
          return [{ variable: "parser_error", value: "Parser Error: Output 2 value must be 0x00 or 0xFF" }];
        }
        data.push({ variable: "output_2", value: value === 0xff ? "Closed" : "Opened" });
      }
      // Temperature
      else if (channel === 0x03 && type === 0x67) {
        data.push({ variable: "temperature", value: buffer.readInt16BE(i) * 0.1, unit: "°C" });
        i += 2;
      }
      // Input 1 State
      else if (channel === 0x05 && type === 0x00) {
        const value = buffer[i++];
        if (value !== 0x00 && value !== 0x01) {
          return [{ variable: "parser_error", value: "Parser Error: Input value must be 0x00 or 0x01" }];
        }
        data.push({ variable: "input_1", value: value === 0x01 ? "Opened" : "Closed" });
      }
      // Input 2
      else if (channel === 0x06 && type === 0x02) {
        data.push({ variable: "input_2", value: buffer.readUInt16BE(i), unit: "uA" });
        i += 2;
      }
      // Input 3
      else if (channel === 0x07 && type === 0x02) {
        data.push({ variable: "input_3", value: buffer.readUInt16BE(i), unit: "mV" });
        i += 2;
      }
      // Input 1 Count
      else if (channel === 0x08 && type === 0x04) {
        data.push({ variable: "input_1_count", value: buffer.readUInt16BE(i), unit: "count" });
        i += 2;
      }
      // MCU temperature
      else if (channel === 0x09 && type === 0x67) {
        data.push({ variable: "mcu_temperature", value: buffer.readInt16BE(i) * 0.1, unit: "°C" });
        i += 2;
      }
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    // Return the variable parse_error for debugging.
    return [{ variable: "parser_error", value: e.message }];
  }
}

// let payload = [{ variable: "payload", value: "0500ff08040005" }];

// Remove unwanted variables.

export default async function parserIndustrialTransceiver(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  payload = payload.filter((x) => !ignore_vars.includes(x.variable));

  const payload_raw = payload.find(
    (x) => x.variable === "payload_raw" || x.variable === "payload" || x.variable === "data"
  );
  if (payload_raw) {
    // Get a unique serie for the incoming data.
    const { value } = payload_raw;

    let { serie } = payload_raw;

    if (!serie) {
      serie = new Date().getTime();
    }

    // Parse the payload_raw to JSON format (it comes in a String format)
    if (value) {
      payload = payload.concat(parsePayload(value)).map((x) => ({ ...x, serie }));
    }
  }

  return payload;
}

// console.log(payload);
