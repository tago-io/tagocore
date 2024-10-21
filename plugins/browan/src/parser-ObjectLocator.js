/* eslint-disable no-bitwise */
/* eslint-disable no-restricted-properties */
function Decoder(bytes, port) {
  const decoded = [];
  if (port === 136) {
    // STATUS
    decoded.push({ variable: "button_trigger_event", value: bytes[0] & 1 });
    decoded.push({ variable: "no_gnss_fix", value: (bytes[0] & 0x0f) >> 3 });
    // BATTERY
    const battery_level = bytes.readUInt8(1);
    decoded.push({
      variable: "battery",
      value: (25 + (battery_level & 0x0f)) / 10,
      unit: "V",
    });
    decoded.push({
      variable: "remaining_battery_capacity",
      value: Number((100 * ((battery_level >> 4) / 15)).toPrecision(4)),
      unit: "%",
    });
    // TEMPERATURE
    decoded.push({
      variable: "temperature",
      value: (bytes.readUInt8(2) & 0x7f) - 32,
      unit: "°C",
    });

    // LOCATION
    // GNSS Fix?
    let positionGnssFix = false;
    if ((bytes[0] & 0x8) === 0) {
      positionGnssFix = true;
    }

    // Accuracy Measurement
    let positionAccuracy = bytes[10] >> 5;
    positionAccuracy = 2 ** (Number.parseInt(positionAccuracy) + 2);

    // Mask off end of accuracy byte, so longitude doesn't get affected
    bytes[10] &= 0x1f;

    if ((bytes[10] & (1 << 4)) !== 0) {
      bytes[10] |= 0xe0;
    }

    // Mask off end of latitude byte, RFU
    bytes[6] &= 0x0f;

    // Latitude and Longitude Measurement
    let positionLatitude =
      (bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | bytes[3];
    let positionLongitude =
      (bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | bytes[7];
    positionLatitude /= 1000000;
    positionLongitude /= 1000000;

    decoded.push({
      variable: "location",
      value: `${positionLatitude},${positionLongitude}`,
      location: { lat: positionLatitude, lng: positionLongitude },
    });
    decoded.push({ variable: "accuracy", value: positionAccuracy, unit: "m" });
  }

  return decoded;
}

export default async function parserObjectLocator(payload) {
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
