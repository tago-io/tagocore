function Decoder(bytes, port) {
  const decoded = [];
  if (port === 105) {
    // STATUS
    decoded.push({ variable: "threshold_event", value: bytes[0] & 1 });
    // BATTERY
    const battery_level = bytes.readUInt8(1);
    decoded.push({
      variable: "battery",
      value: (25 + (battery_level & 0x0f)) / 10,
      unit: "V",
    });
    // TEMPERATURE
    decoded.push({
      variable: "temperature",
      value: (bytes.readUInt8(2) & 0x7f) - 32,
      unit: "°C",
    });
    // DECIBEL
    decoded.push({
      variable: "decibel",
      value: bytes.readUInt8(3),
      unit: "dBA",
    });
  }

  return decoded;
}

export default async function parserSoundLevel(payload) {
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
