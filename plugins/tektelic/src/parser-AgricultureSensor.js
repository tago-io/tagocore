function Decoder(bytes, port) {
  const decoded = [];
  if (port === 10) {
    let soil_temp_cont = 0;
    let soil_moist_cont = 0;
    for (let i = 0; i < bytes.length; ) {
      const channel = bytes[i++];
      const type = bytes[i++];

      if (channel === 0x00 && type === 0xba) {
        const byte = bytes.readUInt8(i++);
        decoded.push({
          variable: "battery_voltage",
          value: (byte & 0x7f) * 0.01 + 2.5,
          unit: "V",
        });
        decoded.push({ variable: "eos_alert", value: byte >> 7 });
      } else if (channel === 0x00 && type === 0xff) {
        const byte = bytes.readUInt16BE(i);
        i += 2;
        decoded.push({
          variable: "battery_voltage",
          value: byte * 0.01,
          unit: "V",
        });
      } else if (channel === 0x01 && type === 0x04) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({
          variable: "soil_moisture_raw",
          value: byte,
          unit: "kHz",
        });
        i += 2;
        if (byte > 1402 && byte <= 1399)
          decoded.push({ variable: "soil_gwc", value: 0 });
        else if (byte > 1399 && byte <= 1396)
          decoded.push({ variable: "soil_gwc", value: 0.1 });
        else if (byte > 1396 && byte <= 1391)
          decoded.push({ variable: "soil_gwc", value: 0.2 });
        else if (byte > 1391 && byte <= 1386)
          decoded.push({ variable: "soil_gwc", value: 0.3 });
        else if (byte > 1386 && byte <= 1381)
          decoded.push({ variable: "soil_gwc", value: 0.4 });
        else if (byte > 1381 && byte <= 1376)
          decoded.push({ variable: "soil_gwc", value: 0.5 });
        else if (byte > 1376 && byte <= 1371)
          decoded.push({ variable: "soil_gwc", value: 0.6 });
        else if (byte > 1371 && byte <= 1366)
          decoded.push({ variable: "soil_gwc", value: 0.7 });
        else if (byte > 1366 && byte <= 1361)
          decoded.push({ variable: "soil_gwc", value: 0.8 });
        else if (byte > 1361 && byte <= 1356)
          decoded.push({ variable: "soil_gwc", value: 0.9 });
        else if (byte > 1356 && byte <= 1351)
          decoded.push({ variable: "soil_gwc", value: 1 });
        else if (byte > 1351 && byte <= 1346)
          decoded.push({ variable: "soil_gwc", value: 1.1 });
        else if (byte > 1346 && byte <= 1341)
          decoded.push({ variable: "soil_gwc", value: 1.2 });
        else if (byte > 1341 && byte <= 1322)
          decoded.push({ variable: "soil_gwc", value: 2 });
      } else if (channel === 0x02 && type === 0x02) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({ variable: "soil_temp_raw", value: byte, unit: "mV" });
        decoded.push({
          variable: "soil_temp",
          value: -32.46 * Math.log(byte) + 236.36,
          unit: "°C",
        });
        i += 2;
      } else if (channel === 0x03 && type === 0x02) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({ variable: "soil_temp_raw1", value: byte, unit: "mV" });
        decoded.push({
          variable: "soil_temp1",
          value: -31.96 * Math.log(byte) + 213.25,
          unit: "°C",
        });
        i += 2;
        soil_temp_cont += 1;
      } else if (channel === 0x04 && type === 0x02) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({ variable: "soil_temp_raw2", value: byte, unit: "mV" });
        decoded.push({
          variable: "soil_temp2",
          value: -31.96 * Math.log(byte) + 213.25,
          unit: "°C",
        });
        i += 2;
        soil_temp_cont += 2;
      } else if (channel === 0x05 && type === 0x04) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({
          variable: "soil_moisture_raw1",
          value: byte,
          unit: "Hz",
        });
        i += 2;
        if (byte < 293)
          decoded.push({
            variable: "soil_water_tension1",
            value: 200,
            unit: "kPa",
          });
        else if (byte <= 485)
          decoded.push({
            variable: "soil_water_tension1",
            value: 200 - (byte - 293) * 0.5208,
            unit: "kPa",
          });
        else if (byte <= 600)
          decoded.push({
            variable: "soil_water_tension1",
            value: 100 - (byte - 485) * 0.2174,
            unit: "kPa",
          });
        else if (byte <= 770)
          decoded.push({
            variable: "soil_water_tension1",
            value: 75 - (byte - 600) * 0.1176,
            unit: "kPa",
          });
        else if (byte <= 1110)
          decoded.push({
            variable: "soil_water_tension1",
            value: 55 - (byte - 770) * 0.05884,
            unit: "kPa",
          });
        else if (byte <= 2820)
          decoded.push({
            variable: "soil_water_tension1",
            value: 35 - (byte - 1110) * 0.0117,
            unit: "kPa",
          });
        else if (byte <= 4330)
          decoded.push({
            variable: "soil_water_tension1",
            value: 15 - (byte - 2820) * 0.003974,
            unit: "kPa",
          });
        else if (byte <= 6430)
          decoded.push({
            variable: "soil_water_tension1",
            value: 9 - (byte - 4330) * 0.004286,
            unit: "kPa",
          });
        else if (byte > 6430)
          decoded.push({
            variable: "soil_water_tension1",
            value: 0,
            unit: "kPa",
          });
        // adjust with soil_temp1 after all variables are collected
        soil_moist_cont += 1;
      } else if (channel === 0x06 && type === 0x04) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({
          variable: "soil_moisture_raw2",
          value: byte,
          unit: "Hz",
        });
        i += 2;
        if (byte < 293)
          decoded.push({
            variable: "soil_water_tension2",
            value: 200,
            unit: "kPa",
          });
        else if (byte <= 485)
          decoded.push({
            variable: "soil_water_tension2",
            value: 200 - (byte - 293) * 0.5208,
            unit: "kPa",
          });
        else if (byte <= 600)
          decoded.push({
            variable: "soil_water_tension2",
            value: 100 - (byte - 485) * 0.2174,
            unit: "kPa",
          });
        else if (byte <= 770)
          decoded.push({
            variable: "soil_water_tension2",
            value: 75 - (byte - 600) * 0.1176,
            unit: "kPa",
          });
        else if (byte <= 1110)
          decoded.push({
            variable: "soil_water_tension2",
            value: 55 - (byte - 770) * 0.05884,
            unit: "kPa",
          });
        else if (byte <= 2820)
          decoded.push({
            variable: "soil_water_tension2",
            value: 35 - (byte - 1110) * 0.0117,
            unit: "kPa",
          });
        else if (byte <= 4330)
          decoded.push({
            variable: "soil_water_tension2",
            value: 15 - (byte - 2820) * 0.003974,
            unit: "kPa",
          });
        else if (byte <= 6430)
          decoded.push({
            variable: "soil_water_tension2",
            value: 9 - (byte - 4330) * 0.004286,
            unit: "kPa",
          });
        else if (byte > 6430)
          decoded.push({
            variable: "soil_water_tension2",
            value: 0,
            unit: "kPa",
          });
        // adjust with soil_temp2 after all variables are collected
        soil_moist_cont += 2;
      } else if (channel === 0x09 && type === 0x65) {
        const byte = bytes.readUInt16BE(i);
        decoded.push({ variable: "ambient_light", value: byte, unit: "lux" });
        i += 2;
      } else if (channel === 0x09 && type === 0x00) {
        const byte = bytes.readUInt8(i++);
        decoded.push({
          variable: "ambient_light_detected",
          value: byte === 0x00 ? "no" : "yes",
        });
      } else if (channel === 0x0a && type === 0x71) {
        const byte_x = bytes.readInt16BE(i);
        i += 2;
        const byte_y = bytes.readInt16BE(i);
        i += 2;
        const byte_z = bytes.readInt16BE(i);
        i += 2;
        decoded.push({
          variable: "acceleration_xaxis",
          value: byte_x * 0.001,
          unit: "g",
        });
        decoded.push({
          variable: "acceleration_yaxis",
          value: byte_y * 0.001,
          unit: "g",
        });
        decoded.push({
          variable: "acceleration_zaxis",
          value: byte_z * 0.001,
          unit: "g",
        });
      } else if (channel === 0x0a && type === 0x00) {
        const byte = bytes.readUInt8(i++);
        decoded.push({
          variable: "orientation_alarm",
          value: byte === 0x00 ? "no" : "yes",
        });
      } else if (channel === 0x0b && type === 0x67) {
        const byte = bytes.readInt16BE(i);
        i += 2;
        decoded.push({
          variable: "ambient_temp",
          value: byte * 0.1,
          unit: "°C",
        });
      } else if (channel === 0x0b && type === 0x68) {
        const byte = bytes.readUInt8(i++);
        decoded.push({ variable: "ambient_hum", value: byte * 0.5, unit: "%" });
      } else if (channel === 0x0c && type === 0x67) {
        const byte = bytes.readInt8(i++);
        decoded.push({ variable: "mcu_temp", value: byte * 0.1, unit: "°C" });
      }
    }
    if (soil_moist_cont > 0 && soil_temp_cont > 0) {
      const temp1 = decoded.find((x) => x.variable === "soil_temp1");
      const temp2 = decoded.find((x) => x.variable === "soil_temp2");
      const moist1 = decoded.find((x) => x.variable === "soil_water_tension1");
      const moist2 = decoded.find((x) => x.variable === "soil_water_tension2");

      if (temp1.value && temp1.value !== 24.0 && moist1.value) {
        decoded.push({
          variable: "soil_water_tension1_adjusted",
          value: moist1.value * (1 - 0.019 * (temp1.value - 24)),
          unit: "kPa",
        });
      }
      if (temp2.value && temp2.value !== 24.0 && moist2.value) {
        decoded.push({
          variable: "soil_water_tension2_adjusted",
          value: moist2.value * (1 - 0.019 * (temp2.value - 24)),
          unit: "kPa",
        });
      }
    }
  }

  return decoded;
}

// let payload = [
//   { variable: "payload", value: "096500000b6700e10b6892" },
//   { variable: "port", value: "10" },
// ];

export default async function parserAgricultureSensor(payload) {
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
  );
  if (data) {
    const serie = new Date().getTime();
    const bytes = Buffer.from(data.value, "hex");
    payload = payload
      .concat(Decoder(bytes, Number.parseInt(port.value, 10)))
      .map((x) => ({ ...x, serie }));
  }

  // console.log(payload);

  return payload;
}
