function Decoder(bytes, port) {
  const decoded = [];
  // status message
  if (port !== 103)
    return [
      { variable: "parse_error", value: "Parser error: Port must be 103" },
    ];
  if (bytes.length !== 11)
    return [
      {
        variable: "parse_error",
        value: "Parser error: Bytes length doesn't match",
      },
    ];
  // status -- byte 0
  decoded.push({ variable: "status_event", value: bytes[0] & 0x01 });
  decoded.push({
    variable: "status_type",
    value:
      (bytes[0] >> 3) & 0x01 ? "Temperature and Humidity sensor" : "IAQ Sensor",
  });
  decoded.push({
    variable: "status_temperature_change",
    value: (bytes[0] >> 4) & 0x01,
  });
  decoded.push({
    variable: "status_humidity_change",
    value: (bytes[0] >> 5) & 0x01,
  });
  decoded.push({
    variable: "status_iaq_change",
    value: (bytes[0] >> 6) & 0x01,
  });
  // battery -- byte 1 (1 to 14)
  if ([0, 15].includes(bytes[1] & 0x0f))
    return [
      {
        variable: "parse_error",
        value: "Parser error: Battery must be between 2.6 and 3.9 V",
      },
    ];
  decoded.push({
    variable: "battery",
    value: (25 + (bytes[1] & 0x0f)) / 10,
    unit: "V",
  });
  // temp (pcb) -- byte 2
  decoded.push({
    variable: "board_temperature",
    value: (bytes[2] & 0x7f) - 32,
    unit: "°C",
  });
  // rh -- byte 3 (max 100)
  if ((bytes[3] & 0x7f) > 100)
    return [
      {
        variable: "parse_error",
        value: "Parser error: Max value for humidity is 100%",
      },
    ];
  decoded.push({ variable: "humidity", value: bytes[3] & 0x7f, unit: "%" });
  // co2 -- bytes 4, 5
  decoded.push({ variable: "eco2", value: bytes.readUInt16BE(4), unit: "ppm" });
  // voc -- bytes 6, 7
  decoded.push({ variable: "voc", value: bytes.readUInt16BE(6), unit: "ppm" });
  // iaq -- bytes 8, 9 (0 to 500)
  if (bytes.readUInt16BE(8) > 500)
    return [
      {
        variable: "parse_error",
        value: "Parser error: Max value for IAQ is 500",
      },
    ];
  decoded.push({ variable: "iaq", value: bytes.readUInt16BE(8) });
  // environment temp -- byte 10
  decoded.push({
    variable: "environment_temperature",
    value: (bytes[10] & 0x7f) - 32,
    unit: "°C",
  });

  return decoded;
}

// let payload = [{ variable: "payload", value: "790a2a5f2744274427442a" }, { variable: "port", value: "103" }];
// let payload = [{ variable: "payload", value: "79ffffffffffffffffffff" }, { variable: "port", value: "103" }];

export default async function parserHealthyHomeSensor(payload) {
  if (!Array.isArray(payload)) {
    payload = [payload];
  }

  const data = payload.find(
    (item) =>
      item.variable === "data" ||
      item.variable === "payload" ||
      item.variable === "payload_raw",
  );
  const port = payload.find(
    (item) => item.variable === "port" || item.variable === "fport",
  );

  if (data) {
    const bytes = Buffer.from(data.value, "hex");
    const serie = new Date().getTime();
    payload = payload
      .concat(Decoder(bytes, Number(port.value)))
      .map((x) => ({ ...x, serie }));
  }

  return payload;
}

// console.log(payload);
