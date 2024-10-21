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
// Decode an uplink message from an array of bytes to an object of fields
function Decoder(bytes) {
  // Decode an uplink message from a buffer
  // (array) of bytes to an object of fields.
  const decoded = {};

  if (bytes == null) {
    return null;
  }

  // if (port === 103) {
  // parse status
  decoded.status = {
    value: bytes.readUInt8(0),
  };

  // parse battery voltage
  decoded.battery_voltage = {
    value: Number(((25 + ((bytes[1] & 0x0f) >>> 0)) / 10).toFixed(1)),
    unit: "V",
  };

  // parse temperature °C
  decoded.temperature = {
    value: ((bytes[2] & 0x7f) >>> 0) - 32,
    unit: "°C",
  };

  // parse humidity
  decoded.relative_humidity = {
    value: (bytes[3] & 0x7f) >>> 0,
    unit: "%",
  };

  // decoded.co2 = bytes.readUInt16LE(4);

  // decoded.voc = bytes.readUInt16LE(6);

  return decoded;
}

export default async function parserTemperatureHumiditySensor(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find((x) => x.variable === "data" || x.variable === "payload");
  if (data) {
    const serie = data.serie || new Date().getTime();
    const vars_to_tago = Decoder(Buffer.from(data.value, "hex"));

    payload = [...payload, ...toTagoFormat(vars_to_tago, serie)];
    payload = payload.filter((x) => !ignore_vars.includes(x.variable));
  }

  return payload;
}
