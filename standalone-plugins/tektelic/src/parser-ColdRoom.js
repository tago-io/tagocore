/* eslint-disable no-nested-ternary */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
function Decoder(bytes, port) {
  const decoded = [];
  if (port === 10) {
    for (let i = 0; i < bytes.length; ) {
      const channel = bytes[i++];
      const type = bytes[i++];
      // battery voltage
      if (channel === 0x00 && type === 0xff) {
        decoded.push({ variable: "battery_voltage", value: bytes.readInt16BE(i) * 0.01, unit: "V" });
        i += 2;
      }
      // external connector: digital input state
      else if (channel === 0x0e && type === 0x00) {
        if (bytes.readUInt8(i) !== 0xff && bytes.readUInt8(i) !== 0x00) {
          return [{ variable: "parser_error", value: "Parser error: digital input state only accepts 0x00 or 0xFF" }];
        }
        decoded.push({
          variable: "extconnector_state",
          value: bytes[i++] === 0xff ? "open-circuited" : "short-circuited",
        });
      }
      // external connector: digital input count
      else if (channel === 0x0f && type === 0x04) {
        decoded.push({ variable: "extconnector_count", value: bytes.readUInt16BE(i) });
        i += 2;
      }
      // mcu temperature
      else if (channel === 0x0b && type === 0x67) {
        decoded.push({ variable: "mcu_temperature", value: bytes.readInt16BE(i) * 0.1, unit: "°C" });
        i += 2;
      }
      // ambient temperature
      else if (channel === 0x03 && type === 0x67) {
        decoded.push({ variable: "ambient_temperature", value: bytes.readInt16BE(i) * 0.1, unit: "°C" });
        i += 2;
      }
      // ambient rh
      else if (channel === 0x04 && type === 0x68) {
        decoded.push({ variable: "relative_humidity", value: bytes.readUInt8(i++) * 0.5, unit: "%" });
      }
    }
  } else if (port === 100) {
    for (let i = 0; i < bytes.length; ) {
      const address = bytes[i++];

      if (address === 0x10) {
        decoded.push({ variable: "loramac_join_mode", value: bytes.readUInt16BE(i) >> 15 });
        i += 2;
      } else if (address === 0x11) {
        const opts = bytes.readUInt16BE(i);
        decoded.push({ variable: "loramac_opts_confirm_mode", value: opts & 0x01 });
        decoded.push({ variable: "loramac_opts_sync_word", value: (opts >> 1) & 0x01 });
        decoded.push({ variable: "loramac_opts_duty_cycle", value: (opts >> 2) & 0x01 });
        decoded.push({ variable: "loramac_opts_adr", value: (opts >> 3) & 0x01 });
        i += 2;
      } else if (address === 0x12) {
        const dr_tx = bytes.readUInt16BE(i);
        decoded.push({ variable: "loramac_dr_tx_dr_number", value: (dr_tx >> 8) & 0x0f });
        decoded.push({ variable: "loramac_dr_tx_tx_power_number", value: dr_tx & 0x0f });
        i += 2;
      } else if (address === 0x13) {
        const rx2 = bytes.slice(i, i + 5);
        decoded.push({ variable: "loramac_rx2_frequency", value: rx2.readUInt32BE(0), unit: "Hz" });
        decoded.push({ variable: "loramac_rx2_dr_number", value: rx2.readUInt8(4) });
        i += 5;
      } else if (address === 0x20) {
        const ticks = bytes.readUInt32BE(i);
        i += 4;
        if ((ticks > 0 && ticks < 60) || ticks > 86400) {
          continue;
        }
        decoded.push({ variable: "seconds_per_core_tick", value: ticks, unit: "sec" });
      } else if (address === 0x21) {
        decoded.push({ variable: "tick_per_battery", value: bytes.readUInt16BE(i) });
        i += 2;
      } else if (address === 0x22) {
        decoded.push({ variable: "tick_per_ambient_temperature", value: bytes.readUInt16BE(i) });
        i += 2;
      } else if (address === 0x23) {
        decoded.push({ variable: "tick_per_relative_humidity", value: bytes.readUInt16BE(i) });
        i += 2;
      } else if (address === 0x27) {
        decoded.push({ variable: "tick_per_mcu_temperature", value: bytes.readUInt16BE(i) });
        i += 2;
      } else if (address === 0x39) {
        const idle = bytes.readUInt32BE(i);
        i += 4;
        if (idle < 30 || idle > 86400) {
          continue;
        }
        decoded.push({ variable: "temperature_relative_humidity_sample_period_idle", value: idle, unit: "sec" });
      } else if (address === 0x3a) {
        const active = bytes.readUInt32BE(i);
        if (active < 30 || active > 86400) {
          continue;
        }
        decoded.push({ variable: "temperature_relative_humidity_sample_period_active", value: active, unit: "sec" });
        i += 4;
      } else if (address === 0x3b) {
        const high = bytes.readInt8(i++);
        const low = bytes.readInt8(i++);
        if (high <= low) {
          continue;
        }
        decoded.push({ variable: "ambient_temperature_threshold_high", value: high, unit: "°C" });
        decoded.push({ variable: "ambient_temperature_threshold_low", value: low, unit: "°C" });
      } else if (address === 0x3c) {
        decoded.push({ variable: "ambient_temperature_threshold_enabled", value: bytes.readUInt8(i++) & 0x01 });
      } else if (address === 0x3d) {
        const high = bytes.readUInt8(i++);
        const low = bytes.readUInt8(i++);
        if (high <= low) {
          continue;
        }
        decoded.push({ variable: "relative_humidity_threshold_high", value: high, unit: "%" });
        decoded.push({ variable: "relative_humidity_threshold_low", value: low, unit: "%" });
      } else if (address === 0x3e) {
        decoded.push({ variable: "relative_humidity_threshold_enabled", value: bytes.readUInt8(i++) & 0x01 });
      } else if (address === 0x40) {
        const mcu_temperature_period = bytes.readUInt32BE(i);
        i += 4;
        if (mcu_temperature_period < 30 || mcu_temperature_period > 86400) {
          continue;
        }
        decoded.push({ variable: "mcu_temperature_sample_period_idle", value: mcu_temperature_period, unit: "sec" });
      } else if (address === 0x41) {
        const mcu_temperature_period = bytes.readUInt32BE(i);
        i += 4;
        if (mcu_temperature_period < 30 || mcu_temperature_period > 86400) {
          continue;
        }
        decoded.push({ variable: "mcu_temperature_sample_period_active", value: mcu_temperature_period, unit: "sec" });
      } else if (address === 0x42) {
        const high = bytes.readInt8(i++);
        const low = bytes.readInt8(i++);
        if (high <= low) {
          continue;
        }
        decoded.push({ variable: "mcu_temperature_threshold_high", value: high, unit: "°C" });
        decoded.push({ variable: "mcu_temperature_threshold_low", value: low, unit: "°C" });
      } else if (address === 0x43) {
        decoded.push({ variable: "mcu_temperature_threshold_enabled", value: bytes.readUInt8(i++) & 0x01 });
      } else if (address === 0x70) {
        const flash = bytes.readUInt16BE(i);
        decoded.push({ variable: "write_to_flash_app_configuration", value: (flash >> 14) & 0x01 });
        decoded.push({ variable: "write_to_flash_lora_configuration", value: (flash >> 13) & 0x01 });
        decoded.push({ variable: "write_to_flash_restart_sensor", value: flash & 0x01 });
        i += 2;
      } else if (address === 0x71) {
        decoded.push({ variable: "firmware_version_app_major_version", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_app_minor_version", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_app_revision", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_loramac_major_version", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_loramac_minor_version", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_loramac_revision", value: bytes.readUInt8(i++) });
        decoded.push({ variable: "firmware_version_region", value: bytes.readUInt8(i++) });
      } else if (address === 0x72) {
        const reset = bytes[i++];
        if (reset !== 0x0a && reset !== 0xb0 && reset !== 0xba) {
          continue;
        }
        decoded.push({
          variable: "configuration_factory_reset",
          value: `0x${reset.toString(16)}`,
        });
      }
    }
  }
  return decoded;
}
/*
  let payload = [
    // { variable: "payload", value: "0367000a046828" },
    { variable: "payload", value: "3b46d8" },
    { variable: "port", value: 100 },
  ];
  */

export default async function parserColdRoom(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find((x) => x.variable === "payload_raw" || x.variable === "payload" || x.variable === "data");
  const port = payload.find((x) => x.variable === "port" || x.variable === "fport");

  if (data && port) {
    const buffer = Buffer.from(data.value, "hex");
    const serie = new Date().getTime();
    payload = Decoder(buffer, port.value);
    payload = payload.map((x) => ({ ...x, serie }));
  }

  // console.log(payload);

  return payload;
}
