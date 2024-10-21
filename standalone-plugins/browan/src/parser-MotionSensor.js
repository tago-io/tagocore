/* eslint-disable camelcase */
/* This is an example code for Everynet Parser.
 ** Everynet send several parameters to TagoIO. The job of this parse is to convert all these parameters into a TagoIO format.
 ** One of these parameters is the payload of your device. We find it too and apply the appropriate sensor parse.
 **
 ** IMPORTANT: In most case, you will only need to edit the parsePayload function.
 **
 ** Testing:
 ** You can do manual tests to this parse by using the Device Emulator. Copy and Paste the following code:
 ** [{ "variable": "everynet_payload", "value": "{ \"params\": { \"payload\": \"0109611395\" } }" }]
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
        variable: object_item[key].variable || `${prefix}${key}`,
        value: object_item[key].value,
        serie: object_item[key].serie || serie,
        metadata: object_item[key].metadata,
        location: object_item[key].location,
        unit: object_item[key].unit,
      });
    } else {
      result.push({
        variable: `${prefix}${key}`,
        value: object_item[key],
        serie,
      });
    }
  }

  return result;
}

// Function to convert decimal numbers to binary
function dec2bin(dec) {
  const binary = (dec >>> 0).toString(2);
  return "00000000".substr(binary.length) + binary;
}

// Decode an uplink message from an array of bytes to an object of fields
function Decoder(bytes, port) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  const decoded = {};

  if (bytes == null) {
    return null;
  }

  if (port === 102) {
    // parse status
    decoded.status = {
      value: parseInt(dec2bin(bytes[0]).substr(7, 1), 2),
    };

    // parse battery voltage
    decoded.battery_voltage = {
      value: Number((25 + parseInt(dec2bin(bytes[1]).substr(0, 4), 2)) / 10).toFixed(1),
      unit: "V",
    };

    // parse battery capacity
    decoded.battery_capacity = {
      value: Number((100 * parseInt(dec2bin(bytes[1]).substr(4), 2)) / 15).toFixed(1),
      unit: "%",
    };

    // parse temperature
    decoded.temperature = {
      value: bytes.readUInt8(2) - 32,
      unit: "°C",
    };

    decoded.time_elapsed = bytes.readUInt16LE(3);

    decoded.count = bytes.readUIntLE(5, 3);
  } else {
    return null;
  }

  return decoded;
}

export default async function parserMotionSensor(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  let data = payload.find((x) => x.variable === "data" || x.variable === "payload");
  let port = payload.find((x) => x.variable === "port");
  if (data && port) {
    port = Number(port.value);
    const serie = data.serie || new Date().getTime();
    data = data.value;
    const vars_to_tago = Decoder(Buffer.from(data, "hex"), port);

    payload = [...payload, ...toTagoFormat(vars_to_tago, serie)];
    payload = payload.filter((x) => !ignore_vars.includes(x.variable));
  }

  return payload;
}
