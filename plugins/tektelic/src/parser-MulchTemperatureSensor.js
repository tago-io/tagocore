/* This is an generic payload parser example.
 ** The code find the payload variable and parse it if exists.
 **
 ** IMPORTANT: In most case, you will only need to edit the parsePayload function.
 **
 ** Testing:
 ** You can do manual tests to this parse by using the Device Emulator. Copy and Paste the following code:
 ** [{ "variable": "payload", "value": "0109611395" }]
 **
 ** The ignore_vars variable in this code should be used to ignore variables
 ** from the device that you don't want.
 */
// Add ignorable variables in this array.
const ignore_vars = [];

function toTagoFormat(object_item, serie, prefix = "") {
  const result = [];
  for (const key in object_item) {
    if (ignore_vars.includes(key)) continue;

    if (typeof object_item[key] === "object") {
      result.push({
        variable: object_item[key].variable || `${prefix}${key}`.toLowerCase(),
        value: object_item[key].value,
        serie: object_item[key].serie || serie,
        metadata: object_item[key].metadata,
        location: object_item[key].location,
        unit: object_item[key].unit,
      });
    } else {
      result.push({
        variable: `${prefix}${key}`.toLowerCase(),
        value: object_item[key],
        serie,
      });
    }
  }

  return result;
}

/**
 * This is the main function to parse the payload. Everything else doesn't require your attention.
 * @param {String} payload_raw
 * @returns {Object} containing key and value to TagoIO
 */
function Decoder(payload_raw) {
  try {
    // If your device is sending something different than hex, like base64, just specify it bellow.
    const buffer = Buffer.from(payload_raw, "hex");
    const data = [];
    for (let x = 1; x < buffer.length; x++) {
      // console.log(buffer.slice(x, x+1).toString('hex'))
      if (buffer[x] === 0x00) {
        x += 2;
        data.push({
          variable: "battery_voltage",
          value: buffer.readInt16BE(x++) * 0.01,
          unit: "V",
        });
      } else if (buffer[x] === 0x01) {
        x += 2;
        data.push({
          variable: "output_1",
          value: buffer.readInt8(x) === -1 ? "Closed" : "Opened",
        });
      } else if (buffer[x] === 0x02) {
        x += 2;
        data.push({
          variable: "output_2",
          value: buffer.readInt8(x) === -1 ? "Closed" : "Opened",
        });
      } else if (buffer[x] === 0x03) {
        x += 2;
        data.push({
          variable: "temperature",
          value: buffer.readInt16BE(x++) * 0.1,
          unit: "°C",
        });
      } else if (buffer[x] === 0x04) {
        x += 2;
        data.push({
          variable: "humidity",
          value: buffer.readUInt8(x) / 2,
          unit: "% RH",
        });
      } else if (buffer[x] === 0x05) {
        x += 2;
        data.push({
          variable: "input_1",
          value: buffer.readInt8(x) === -1 ? "Closed" : "Opened",
        });
      } else if (buffer[x] === 0x06) {
        x += 2;
        data.push({
          variable: "input_2",
          value: buffer.readUInt16LE(x++),
          unit: "uA",
        });
      } else if (buffer[x] === 0x07) {
        x += 2;
        data.push({
          variable: "input_3",
          value: buffer.readUInt16LE(x++),
          unit: "mV",
        });
      } else if (buffer[x] === 0x08) {
        x += 2;
        data.push({
          variable: "input_1_count",
          value: buffer.readUInt16BE(x++),
          unit: "mV",
        });
      }
    }
    return data;
  } catch (e) {
    console.log(e);
    // Return the variable parse_error for debugging.
    return [{ variable: "parse_error", value: e.message }];
  }
}
// let payload = [{ variable: 'payload', value: '0104 68 2A 03 67 FF FF 00 FF 01 2C'.replace(/ /g, '') }];
// let payload = [{ variable: 'payload', value: '0104 68 14 05 00 FF 08 04 00 05'.replace(/ /g, '') }];

// Payload is an environment variable. Is where what is being inserted to your device comes in.
// Payload always is an array of objects. [ { variable, value...}, {variable, value...} ...]

export default async function parserMulchTemperatureSensor(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payload_raw = payload.find(
    (x) =>
      x.variable === "payload_raw" ||
      x.variable === "payload" ||
      x.variable === "data",
  );

  if (payload_raw) {
    // Get a unique serie for the incoming data.
    const { value, time } = payload_raw;
    let { serie } = payload_raw;
    serie = new Date().getTime();

    // Parse the payload_raw to JSON format (it comes in a String format)

    if (value) {
      payload = payload.concat(
        toTagoFormat(
          Decoder(Buffer.from(value.replace(/ /g, ""), "hex")),
          serie,
        ),
      );
    }
  }

  return payload;
}
