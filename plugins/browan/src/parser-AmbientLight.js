function Decoder(bytes, port) {
  const decoded = [];
  if (port === 104) {
    // STATUS
    decoded.push({ variable: "darker", value: bytes[0] & 0x01 });
    decoded.push({ variable: "lighter", value: (bytes[0] >> 1) & 0x01 });
    decoded.push({ variable: "status_change", value: (bytes[0] >> 4) & 0x01 });
    decoded.push({ variable: "keep_alive", value: (bytes[0] >> 5) & 0x01 });
    // BATTERY
    decoded.push({
      variable: "battery",
      value: (25 + (bytes.readUInt8(1) & 0x0f)) / 10,
      unit: "V",
    });
    // TEMPERATURE
    decoded.push({
      variable: "temperature",
      value: (bytes.readUInt8(2) & 0x7f) - 32,
      unit: "°C",
    });
    // LUX
    decoded.push({
      variable: "lux",
      value: bytes.readUIntLE(3, 3) / 100,
      unit: "lux",
    });
  }

  return decoded;
}

export default async function parserAmbientLight(payload) {
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
  if (data && port) {
    const serie = data.serie || new Date().getTime();
    const bytes = Buffer.from(data.value, "hex");
    payload = payload
      .concat(Decoder(bytes, Number(port.value)))
      .map((x) => ({ ...x, serie }));
  }

  return payload;
}
