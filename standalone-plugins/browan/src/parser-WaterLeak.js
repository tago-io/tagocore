function Decoder(bytes, port) {
  const decoded = [];
  if (port === 106) {
    // STATUS
    decoded.push({ variable: "water_leakage_detected", value: bytes[0] & 1 });
    decoded.push({ variable: "water_leakage_interrupt", value: (bytes[0] >> 4) & 1 });
    decoded.push({ variable: "temperature_changed", value: (bytes[0] >> 5) & 1 });
    decoded.push({ variable: "humidity_changed", value: (bytes[0] >> 6) & 1 });
    // BATTERY
    const battery_level = bytes.readUInt8(1);
    decoded.push({ variable: "battery", value: (25 + (battery_level & 0x0f)) / 10, unit: "V" });
    // TEMPERATURE (PCB)
    decoded.push({ variable: "temperature_pcb", value: (bytes.readUInt8(2) & 0x7f) - 32, unit: "°C" });
    // RH
    decoded.push({ variable: "humidity", value: bytes.readUInt8(3) & 0x7f, unit: "%" });
    // TEMPERATURE (ENVIRONMENT)
    decoded.push({ variable: "temperature_environment", value: (bytes.readUInt8(4) & 0x7f) - 32, unit: "°C" });
  }

  return decoded;
}

export default async function parserWaterLeak(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find((x) => x.variable === "payload" || x.variable === "payload_raw" || x.variable === "data");
  const port = payload.find((x) => x.variable === "port" || x.variable === "fport");
  if (data && port) {
    const serie = data.serie || new Date().getTime();
    const bytes = Buffer.from(data.value, "hex");
    payload = payload.concat(Decoder(bytes, Number(port.value))).map((x) => ({ ...x, serie }));
  }

  return payload;
}
