/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
/* eslint-disable no-bitwise */
/*
 * Tundra sensor
 */

function signed_convert(val, bitwidth) {
    const isnegative = val & (1 << (bitwidth - 1));
    const boundary = 1 << bitwidth;
    const minval = -boundary;
    const mask = boundary - 1;
    return isnegative ? minval + (val & mask) : val;
  }
  
  function Decoder(bytes, port) {
    // Decode an uplink message from a buffer
    // (array) of bytes to an object of fields.
    // Device Info Not Repeated
    const array_result = [];
    if (port === 10) {
      for (let i = 0; i < bytes.length; ) {
        const channel = bytes[i++];
        const type = bytes[i++];
  
        // battery voltage
        if (channel === 0x00 && type === 0xff) {
          let battery_voltage = (bytes[i] << 8) | bytes[i + 1];
          battery_voltage = signed_convert(battery_voltage, 16);
          array_result.push({ variable: "battery_voltage", value: Number((battery_voltage * 0.01).toFixed(2)), unit: "V" });
          i += 2;
        }
        // mcu temperature
        if (channel === 0x0b && type === 0x67) {
          let mcu_temperature = (bytes[i] << 8) | bytes[i + 1];
          mcu_temperature = signed_convert(mcu_temperature, 16);
          array_result.push({ variable: "mcu_temperature", value: Number((mcu_temperature * 0.1).toFixed(2)), unit: "°C" });
          i += 2;
        }
  
        if (channel === 0x03 && type === 0x67) {
          let ambient_temperature = (bytes[i] << 8) | bytes[i + 1];
          ambient_temperature = signed_convert(ambient_temperature, 16);
          if (ambient_temperature === 65535) {
            ambient_temperature = -1;
          }
          array_result.push({ variable: "ambient_temperature", value: Number((ambient_temperature * 0.1).toFixed(2)), unit: "°C" });
          i += 2;
        }
        // impact alarm
        if (channel === 0x0c && type === 0x00) {
          let impact_alarm = bytes[i];
          if (impact_alarm === 0xff) {
            impact_alarm = "Impact alarm active";
          }
          if (impact_alarm === 0x00) {
            impact_alarm = "Impact alarm inactive";
          }
          array_result.push({ variable: "impact_alarm", value: impact_alarm });
          i += 1;
        }
        // Acceleration Magnitude
        if (channel === 0x05 && type === 0x02) {
          const acceleration_magnitude = (bytes[i] << 8) | bytes[i + 1];
          array_result.push({ variable: "acceleration_magnitude", value: acceleration_magnitude, unit: "g" });
          i += 2;
        }
        // Acceleration Vector
        if (channel === 0x07 && type === 0x71) {
          const acceleration_vector_x = (bytes[i] << 8) | bytes[i + 1];
          array_result.push({ variable: "acceleration_x_axis", value: acceleration_vector_x, unit: "g" });
          const acceleration_vector_y = (bytes[i + 2] << 8) | bytes[i + 3];
          array_result.push({ variable: "acceleration_y_axis", value: acceleration_vector_y, unit: "g" });
          const acceleration_vector_z = (bytes[i + 4] << 8) | bytes[i + 5];
          array_result.push({ variable: "acceleration_z_axis", value: acceleration_vector_z, unit: "g" });
          i += 6;
        }
      }
      return array_result;
    }
    if (port === 32) {
      let flag_entry = 0;
      for (let i = 0; i < bytes.length; ) {
        if (flag_entry === 0) {
          flag_entry = 1;
          const tag_entry = (bytes[0] << 8) | bytes[i + 1];
          array_result.push({ variable: "tag_entry", value: tag_entry });
          i += 2;
        }
        const channel = bytes[i++];
        const type = bytes[i++];
        if (channel === 0x03 && type === 0x67) {
          let ambient_temperature = (bytes[i] << 8) | bytes[i + 1];
          ambient_temperature = signed_convert(ambient_temperature, 16);
          if (ambient_temperature === 65535) {
            ambient_temperature = -1;
          }
          array_result.push({ variable: "ambient_temperature", value: Number((ambient_temperature * 0.1).toFixed(2)), unit: "°C" });
          i += 2;
        }
        if (channel === 0x04 && type === 0x68) {
          const ambient_rh = bytes[i];
          array_result.push({ variable: "ambient_rh", value: Number((ambient_rh * 0.5).toFixed(2)), unit: "%" });
          i += 1;
        }
      }
      flag_entry = 0;
      return array_result;
    }
    if (port === 33) {
      for (let i = 0; i < bytes.length; ) {
        const channel = bytes[i++];
        const type = bytes[i++];
        if (channel === 0x03 && type === 0x67) {
          let ambient_temperature = (bytes[i] << 8) | bytes[i + 1];
          ambient_temperature = signed_convert(ambient_temperature, 16);
          array_result.push({ variable: "ambient_temperature", value: Number((ambient_temperature * 0.1).toFixed(2)), unit: "°C" });
          i += 2;
        }
        if (channel === 0x04 && type === 0x68) {
          const ambient_rh = bytes[i];
          array_result.push({ variable: "ambient_rh", value: Number((ambient_rh * 0.5).toFixed(2)), unit: "%" });
          i += 1;
        }
      }
      return array_result;
    }
  }

export default async function parserTundraSensor(payload) {
    if (!Array.isArray(payload)) {
      payload = [payload];
    }
    
    const payload_raw = payload.find((x) => x.variable === "payload_raw" || x.variable === "payload" || x.variable === "data" || x.variable === "payload_hex");
    const port = payload.find((x) => x.variable === "port" || x.variable === "fport" || x.variable === "FPort");
    if (payload_raw) {
      try {
        // Convert the data from Hex to Javascript Buffer.
        const buffer = Buffer.from(payload_raw.value, "hex");
        const serie = new Date().getTime();
        const payload_aux = Decoder(buffer, port.value);
        payload = payload.concat(payload_aux.map((x) => ({ ...x, serie })));
      } catch (e) {
        // Print the error to the Live Inspector.
        console.error(e);
        // Return the variable parse_error for debugging.
        payload = [{ variable: "parse_error", value: e.message }];
      }
    }

    return payload;
}
  
