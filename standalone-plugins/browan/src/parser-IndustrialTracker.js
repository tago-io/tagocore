/* eslint-disable no-bitwise */
function signed_convert(val, bitwidth) {
  const isnegative = val & (1 << (bitwidth - 1));
  const boundary = 1 << bitwidth;
  const minval = -boundary;
  const mask = boundary - 1;
  return isnegative ? minval + (val & mask) : val;
}
function Decoder(bytes, port) {
  const decoded = [];

  if (port === 136) {
    decoded.push({ variable: "moving_mode", value: bytes[0] & 1 });
    decoded.push({ variable: "no_gnss_fix", value: !!((bytes[0] & 0x8) >> 3) });
    decoded.push({
      variable: "temperature",
      value: (bytes.readUInt8(2) & 0x7f) - 32,
      unit: "°C",
    });

    const battery = bytes[1];
    // const capacity = battery >> 4;
    const voltage = battery & 0x0f;
    decoded.push({
      variable: "battery",
      value: (25 + voltage) / 10,
      unit: "V",
    });

    let accuracy = bytes[10] >> 5;
    accuracy = Math.pow(2, parseInt(accuracy) + 2);

    decoded.push({ variable: "accuracy", value: accuracy, unit: "m" });

    // Mask off end of accuracy byte, so lon doesn't get affected
    bytes[10] &= 0x1f;

    if ((bytes[10] & (1 << 4)) !== 0) {
      bytes[10] |= 0xe0;
    }

    // Mask off end of lat byte, RFU
    //bytes[6] &= 0x0f;

    let lat = (bytes[6] << 24) | (bytes[5] << 16) | (bytes[4] << 8) | bytes[3];
    let lon = (bytes[10] << 24) | (bytes[9] << 16) | (bytes[8] << 8) | bytes[7];

    if (lat > 134217727) {
      lat = lat - 268435456;
    }

    lat /= 1000000;
    lon /= 1000000;

    decoded.push({
      variable: "location",
      value: `${lat},${lon}`,
      location: { lat, lng: lon },
    });

    return decoded;
  }
}

export default async function parserIndustrialTracker(payload) {
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
