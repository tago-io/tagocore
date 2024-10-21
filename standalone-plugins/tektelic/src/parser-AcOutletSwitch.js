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
// payload example from the documentation '00FE0001518000006A50000000'; | '0080CB750180415C0081FF';
// Add ignorable variables in this array.
const ignore_vars = [
  "device_addr",
  "port",
  "duplicate",
  "network",
  "packet_hash",
  "application",
  "device",
  "packet_id",
];

/**
 * Convert an object to TagoIO object format.
 * Can be used in two ways:
 * toTagoFormat({ myvariable: myvalue , anothervariable: anothervalue... })
 * toTagoFormat({ myvariable: { value: myvalue, unit: 'C', metadata: { color: 'green' }} , anothervariable: anothervalue... })
 *
 * @param {Object} object_item Object containing key and value.
 * @param {String} serie Serie for the variables
 * @param {String} prefix Add a prefix to the variables name
 */
function toTagoFormat(object_item, serie, prefix = "") {
  const result = [];
  for (const key in object_item) {
    if (ignore_vars.includes(key)) continue;

    if (typeof object_item[key] == "object") {
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

/**
 *  In the solutions params is where usually latitude and longitude for your antenna signal comes from.
 * @param {Object} solutions gateway object from everynet
 * @param {String|Number} serie serie for the variables
 */
function transformSolutionParam(solutions, serie) {
  let to_tago = [];
  for (const s of solutions) {
    let convert_json = {};
    convert_json.base_location = { value: `${s.lat}, ${s.lng}`, location: { lat: s.lat, lng: s.lng } };
    delete s.lat;
    delete s.lng;

    convert_json = { ...convert_json, ...s };
    to_tago = to_tago.concat(toTagoFormat(convert_json, serie));
  }

  return to_tago;
}

function parsePayload(payload_raw, serie) {
  // If your device is sending something different than hex, like base64, just specify it bellow.
  const buffer = Buffer.from(payload_raw, "hex");

  const data = {};
  let msg_byte;
  let channel;
  for (let x = 1; x < buffer.length; ) {
    switch (buffer[x]) {
      case 254: // FE
        msg_byte = Buffer.from(buffer.slice((x += 1), (x += 4)));
        data.elapsed_time = { value: msg_byte.readInt32BE(0), unit: "seconds", serie };
        msg_byte = Buffer.from(buffer.slice(x, (x += 4)));
        data.energy_consumed = { value: msg_byte.readInt32BE(0), unit: "W-h", serie };
        x += 1;
        break;
      case 0: // 00
        msg_byte = Buffer.from(buffer.slice((x += 1)));
        data.energy_consumption_meter_status = { value: msg_byte.readUInt8(0) === 0 ? "idde" : "active", serie };
        x += 1;
        break;
      case 128: // 80
        channel = buffer[x - 1];
        msg_byte = Buffer.from(buffer.slice((x += 1), (x += 2)));
        if (channel === 0) {
          data.real_power = { value: msg_byte.readInt16BE(0) * 0.1, unit: "W", serie };
        } else {
          data.apparent_power = { value: msg_byte.readInt16BE(0) * 0.1, unit: "W", serie };
        }
        x += 1;
        break;
      case 129: // 81
        msg_byte = Buffer.from(buffer.slice((x += 1)));
        data.power_factor = { value: msg_byte.readUInt8(0) < 254 ? msg_byte.readUInt8(0) : "N/A", unit: "W", serie };
        x += 1;
        break;
      case 116: // 74
        msg_byte = Buffer.from(buffer.slice((x += 1), (x += 2)));
        data.voltmeter = { value: msg_byte.readInt16BE(0) * 0.1, unit: "Vrms", serie };
        x += 1;
        break;
      case 117: // 75
        msg_byte = Buffer.from(buffer.slice((x += 1), (x += 2)));
        data.ammeter = { value: msg_byte.readInt16BE(0) * 0.1, unit: "Arms", serie };
        x += 1;
        break;
      case 1: // 01
        msg_byte = Buffer.from(buffer.slice((x += 1)));
        data.relay_status = { value: msg_byte.readUInt8(0) === 0 ? "Open" : "Closed", serie };
        x += 1;
        break;
      default:
    }
  }

  return data;
}

export default async function parserAcOutletSwitch(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const everynet_payload = payload.find(
    (x) => x.variable === "payload" || x.variable === "payload_raw" || x.variable === "data"
  );
  if (everynet_payload) {
    // Get a unique serie for the incoming data.
    const serie = everynet_payload.serie || new Date().getTime();
    let vars_to_tago = [];
    try {
      vars_to_tago = vars_to_tago.concat(toTagoFormat(parsePayload(everynet_payload.value, serie), serie));
    } catch (e) {
      // Catch any error in the parse code and send to parse_error variable.
      vars_to_tago = vars_to_tago.concat({ variable: "parse_error", value: e.message || e });
    }

    payload = payload.concat(vars_to_tago);
  }

  return payload;
}
