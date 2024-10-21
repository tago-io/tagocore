/* eslint-disable no-mixed-operators */
/* eslint-disable no-bitwise */

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

function pad(num, len) {
  return `00000000${num}`.substr(-len);
}
function roundToTwo(num) {
  return +`${Math.round(`${num}e+2`)}e-2`;
}
function dec_to_bho(n, base) {
  if (n < 0) {
    n = 0xffffffff + n + 1;
  }
  switch (base) {
    case "B":
      return Number.parseInt(n, 10).toString(2);
    case "H":
      return Number.parseInt(n, 10).toString(16);
    case "O":
      return Number.parseInt(n, 10).toString(8);
    default:
      return "Wrong input.........";
  }
}

function toHexString(hex_bytes) {
  return hex_bytes
    .map((byte) => {
      return `00${(byte & 0xff).toString(16)}`.slice(-2);
    })
    .join("");
}
function hex2bin(hex) {
  return `00000000${Number.parseInt(hex, 16).toString(2)}`.substr(-8);
}

function Decoder(bytes, port) {
  const ports = port;
  const v4 = toHexString(bytes);
  const v4_1 = v4.substr(10, 2);
  const v4_2 = v4.substr(0, 2);
  const v4_3 = v4.substr(0, 1);
  const v3 = v4.substr(8, 1);
  const length = v4.length;
  let battery;
  let Tamper;
  let Valve;
  let status_v4;
  let Cable_v4;
  let conf_p;
  let conf_s;
  let unit1;
  let time1;
  let Cable;
  let unit2;
  let time2;
  let temperature;
  let hygrometry;
  let status;
  let DI_0;
  let DI_1;
  let Leakage;
  let Fraud;
  let clas;
  let power;
  let t;
  let t1;
  // Battery operated V3 Old
  if (v4_3 === "3") {
    const msg0 = String.fromCharCode.apply(null, bytes);
    const bat0 = msg0.substr(0, 4);
    battery = Math.round((bat0 - 2000) / 16);
    if (length === 10) {
      const st0 = msg0.substr(4, 1);
      const sta0 = dec_to_bho(st0, "B");
      status = pad(sta0, 8);
      Valve = status.substr(7, 1);
      Tamper = status.substr(6, 1);
    }
  }
  // Battery operated V3 & V4 & Class A
  if (v4_3 === "3") {
    const msg = String.fromCharCode.apply(null, bytes);
    const bat = msg.substr(0, 4);
    battery = Math.round((bat - 2000) / 16);
    if (length >= 10) {
      const st = msg.substr(4, 1);
      const sta = dec_to_bho(st, "B");
      status = pad(sta, 8);
      Valve = status.substr(7, 1);
      Tamper = status.substr(6, 1);
    }
    const st_1 = v4.substr(8, 2);
    t = st_1.substr(0, 1) - 3;
    t1 = st_1.substr(1, 1);
    const st1 = t + t1;
    const st01 = hex2bin(st1);
    status = pad(st01, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = Number.parseInt(msg.substr(6, 2), 16);
    conf_s = msg.substr(8, 2);
    unit1 = msg.substr(8, 2);
    time1 = msg.substr(10, 2);
    unit2 = msg.substr(12, 2);
    time2 = msg.substr(14, 2);
    const T_H = v4.substr(12, 8);
    const temp = T_H.substr(0, 4);
    const box_temp = Number.parseInt(temp, 16);
    temperature = (box_temp / 65536) * 165 - 40;
    const hum = T_H.substr(4, 8);
    const box_hum = Number.parseInt(hum, 16);
    hygrometry = (box_hum / 65536) * 100;
  }
  // Externally power V4 & Class variation
  if (v4_3 !== "3" || v4_3 !== "B" || v4_3 !== "b") {
    const msg1 = String.fromCharCode.apply(1, bytes);
    const st2 = hex2bin(v4_2);
    clas = st2.substr(0, 1);
    power = st2.substr(1, 1);
    const st_3 = v4.substr(8, 2);
    t = st_3.substr(0, 1) - 3;
    t1 = st_3.substr(1, 1);
    const st3 = t + t1;
    const st02 = hex2bin(st3);
    status = pad(st02, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = Number.parseInt(msg1.substr(6, 2), 16);
    conf_s = msg1.substr(8, 2);
    unit1 = msg1.substr(8, 2);
    time1 = msg1.substr(10, 2);
    unit2 = msg1.substr(12, 2);
    time2 = msg1.substr(14, 2);
    const T_H1 = v4.substr(12, 8);
    const temp1 = T_H1.substr(0, 4);
    const box_temp1 = Number.parseInt(temp1, 16);
    temperature = (box_temp1 / 65536) * 165 - 40;
    const hum1 = T_H1.substr(4, 8);
    const box_hum1 = Number.parseInt(hum1, 16);
    hygrometry = (box_hum1 / 65536) * 100;
  }
  // Battery operated V4 & Class variation
  if (v4_3 === "B" || v4_3 === "b") {
    const msg2 = String.fromCharCode.apply(1, bytes);
    const st4 = hex2bin(v4_2);
    clas = st4.substr(0, 1);
    power = st4.substr(1, 1);
    const b = v4.substr(1, 1);
    const b1 = msg2.substr(2, 3);
    const bat1 = b.concat(b1);
    battery = Math.round((bat1 - 2000) / 16);
    const st_5 = v4.substr(8, 2);
    t = st_5.substr(0, 1) - 3;
    t1 = st_5.substr(1, 1);
    const st5 = t + t1;
    const st03 = hex2bin(st5);
    status = pad(st03, 8);
    Valve = status.substr(7, 1);
    Tamper = status.substr(6, 1);
    Cable = status.substr(5, 1);
    DI_0 = status.substr(4, 1);
    DI_1 = status.substr(3, 1);
    Leakage = status.substr(2, 1);
    Fraud = status.substr(1, 1);
    conf_p = Number.parseInt(msg2.substr(7, 2), 16);
    conf_s = msg2.substr(9, 2);
    unit1 = msg2.substr(9, 2);
    time1 = msg2.substr(11, 2);
    unit2 = msg2.substr(13, 2);
    time2 = msg2.substr(15, 2);
    const T_H2 = v4.substr(12, 8);
    const temp2 = T_H2.substr(0, 4);
    const box_temp2 = Number.parseInt(temp2, 16);
    temperature = (box_temp2 / 65536) * 165 - 40;
    const hum2 = T_H2.substr(4, 8);
    const box_hum2 = Number.parseInt(hum2, 16);
    hygrometry = (box_hum2 / 65536) * 100;
  }

  if (v4_1 === "40") {
    if (
      conf_p === 14 ||
      conf_p === 15 ||
      conf_p === 16 ||
      conf_p === 17 ||
      conf_p === 18 ||
      conf_p === 19 ||
      conf_p === 20
    ) {
      return {
        Port: ports,
        Battery: battery,
        Valve,
        Tamper,
        Cable,
        DI_0,
        DI_1,
        Leakage,
        Fraud,
        Class: clas,
        Power: power,
        Schl_Port: conf_p || 0,
        Schl_status: conf_s || 0,
      };
    }
    if (conf_p === 21) {
      return {
        Port: ports,
        Battery: battery,
        Valve,
        Tamper,
        Cable,
        DI_0,
        DI_1,
        Leakage,
        Fraud,
        Class: clas,
        Power: power,
        Schl_status_Port: conf_p || 0,
        Schl_status_ack: conf_s || 0,
      };
    }
    if (conf_p === 12 || conf_p === 13) {
      return {
        Port: ports,
        Battery: battery,
        Valve,
        Tamper,
        Cable,
        DI_0,
        DI_1,
        Leakage,
        Fraud,
        Class: clas,
        Power: power,
        RTC_Port: conf_p || 0,
        RTC_status: conf_s || 0,
      };
    }
    if (conf_p === 9) {
      return {
        Port: ports,
        Battery: battery,
        Valve,
        Tamper,
        Cable,
        DI_0,
        DI_1,
        Leakage,
        Fraud,
        Class: clas,
        Power: power,
        Class_Port: conf_p || 0,
        Class_status: conf_s || 0,
      };
    }
    if (conf_p === 22) {
      return {
        Port: ports,
        Battery: battery,
        Valve,
        Tamper,
        Cable,
        DI_0,
        DI_1,
        Leakage,
        Fraud,
        Class: clas,
        Power: power,
        magnet_Port: conf_p || 0,
        magnet_status: conf_s || 0,
      };
    }
  }
  if (v4_1 === "23") {
    return {
      Port: ports,
      Status: status,
      Battery: battery,
      Valve,
      Tamper,
      Cable,
      DI_0,
      DI_1,
      Leakage,
      Fraud,
      Class: clas,
      Power: power,
      Temperature: roundToTwo(temperature),
      Hygrometry: roundToTwo(hygrometry),
    };
  }

  return {
    Port: ports,
    Battery: battery,
    Valve,
    Tamper,
  };
}

// let payload = [
//   {
//     variable: 'time',
//     value: 1571874770.422976,
//     serie: 1571874770524,
//   },
//   {
//     variable: 'payload',
//     value: '4Be202000008000001',
//     serie: 1571874770524,
//   },
//   {
//     variable: 'port',
//     value: 2,
//     serie: 1571874770524,
//   },
//   {
//     variable: 'duplicate',
//     value: false,
//     serie: 1571874770524,
//   },
//   {
//     variable: 'counter_up',
//     value: 38,
//     serie: 1571874770524,
//   },
//   {
//     variable: 'rx_time',
//     value: 1571874770.3568993,
//     serie: 1571874770524,
//   },
//   {
//     variable: 'encrypted_payload',
//     value: 'c12oeBn03DxbfqcD',
//     serie: 1571874770524,
//   },
// ];
// Check if what is being stored is the ttn_payload.
// Payload is an environment variable. Is where what is being inserted to your device comes in.
// Payload always is an array of objects. [ { variable, value...}, {variable, value...} ...]
export default async function parserSmartValveFull(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const payload_raw = payload.find(
    (x) =>
      x.variable === "payload" ||
      x.variable === "payload_raw" ||
      x.variable === "data",
  );
  const port = payload.find(
    (x) => x.variable === "fport" || x.variable === "port",
  );
  if (payload_raw) {
    // Get a unique serie for the incoming data.
    const serie = payload_raw.serie || new Date().getTime();
    let vars_to_tago = [];
    // Parse the payload from your sensor to function parsePayload
    try {
      const decoded = Decoder(
        Buffer.from(payload_raw.value, "hex"),
        port ? port.value : null,
      );
      console.log(decoded);
      vars_to_tago = vars_to_tago.concat(toTagoFormat(decoded, serie));
    } catch (e) {
      // Catch any error in the parse code and send to parse_error variable.
      vars_to_tago = vars_to_tago.concat({
        variable: "parse_error",
        value: e.message || e,
      });
    }

    payload = payload.concat(vars_to_tago);
  }

  payload = payload.filter((item) => {
    if (item.location) {
      if (item.location.lat === 0 && item.location.lng === 0) {
        return false;
      }
    }
    return true;
  });

  return payload;
}
// console.log(payload)
