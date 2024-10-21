import type { IDeviceData } from "@tago-io/tcore-sdk/types";
import toTagoFormat, { type IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

/**
 * Parse the dc parameter of the payload
 *
 * @param data - dc param from Helium
 * @param data.nonce - DC nonce parameter
 * @param data.balance - DC balance parameter
 * @param serie - serie for grouped data
 * @returns {IDeviceDataLatLng} data parsed
 */
function parseDC(data: { balance: number; nonce: number }, serie: string) {
  const result: IDeviceDataLatLng[] = [];

  // balance
  result.push({ variable: "dc_balance", value: data.balance, serie });
  // nonce
  result.push({ variable: "dc_nonce", value: data.nonce, serie });

  return result;
}

interface IHotspots {
  channel: string;
  frequency: string;
  id: string;
  name: string;
  reported_at: string;
  rssi: number;
  snr: number;
  spreading: number;
  hold_time: string;
  lat: number;
  long: number;
  status: string;
}
/**
 * Parse the hotspots parameter of the payload
 *
 * @param data - hotspots param from Helium
 * @param serie - serie for grouped data
 * @returns {IDeviceDataLatLng} data parsed
 */
function parseHotspots(data: IHotspots[], serie: string) {
  const result: IDeviceDataLatLng[] = [];

  for (let i = 0; i < data.length; ++i) {
    // channel
    result.push({
      variable: `hotspot_${i}_channel`,
      value: data[i].channel,
      serie,
    });
    // frequency
    result.push({
      variable: `hotspot_${i}_frequency`,
      value: data[i].frequency,
      serie,
    });
    // id
    result.push({ variable: `hotspot_${i}_id`, value: data[i].id, serie });
    // lat/long
    if (!Number.isNaN(data[i].lat) && !Number.isNaN(data[i].long)) {
      result.push({
        variable: `hotspot_${i}_location`,
        location: { lat: data[i].lat, lng: data[i].long },
        serie,
      });
    }
    // name
    result.push({ variable: `hotspot_${i}_name`, value: data[i].name, serie });
    // reported_at
    result.push({
      variable: `hotspot_${i}_reported_at`,
      value: data[i].reported_at,
      serie,
    });
    // rssi
    result.push({ variable: `hotspot_${i}_rssi`, value: data[i].rssi, serie });
    // snr
    result.push({ variable: `hotspot_${i}_snr`, value: data[i].snr, serie });
    // spreading
    result.push({
      variable: `hotspot_${i}_spreading`,
      value: data[i].spreading,
      serie,
    });
    // status
    result.push({
      variable: `hotspot_${i}_status`,
      value: data[i].status,
      serie,
    });
    // hold_time
    result.push({
      variable: `hotspot_${i}_hold_time`,
      value: data[i].hold_time,
      serie,
    });
  }

  return result;
}

/**
 * Parse the decoded parameter for latitude and longitude
 *
 * @param decoded - decoded param from Helium
 * @param serie - serie for grouped data
 * @returns {IDeviceDataLatLng} data parsed
 */
function parseDecodedData(decoded: any, serie: string) {
  if (decoded.payload) {
    decoded = decoded.payload;
  }

  const lat = decoded.latitude || decoded.lat;
  const lng = decoded.longitude || decoded.lng;
  const alt = decoded.altitude;
  if (lat && lng && lat !== 0 && lng !== 0) {
    decoded.location = {
      value: `${lat},${lng}`,
      location: { lat: Number(lat), lng: Number(lng) },
    };
    if (alt) decoded.location.metadata = { altitude: alt };
    decoded.latitude = undefined;
    decoded.longitude = undefined;
    decoded.lat = undefined;
    decoded.lng = undefined;
  }
  return toTagoFormat(decoded, serie);
}

/**
 * Decode data from Helium
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng} data parsed
 */
export default async function parser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.payload) {
    return payload;
  }

  let toTago: IDeviceDataLatLng[] = [];
  const serie = String(new Date().getTime());

  // metadata
  if (payload.metadata) {
    toTago = toTago.concat({
      variable: "metadata",
      metadata: payload.metadata,
      value: "metadata",
      serie,
    });
    payload.metadata = undefined;
  }
  // base64 variables
  if (payload.payload) {
    payload.payload = Buffer.from(payload.payload, "base64").toString("hex");
  }
  // base64 variables
  if (payload.decoded) {
    toTago = toTago.concat(parseDecodedData(payload.decoded.payload, serie));
    payload.decoded = undefined;
  }
  // Parse DC
  if (payload.dc) {
    toTago = toTago.concat(parseDC(payload.dc, serie));
    payload.dc = undefined;
  }

  // Parse hotsposts
  if (payload.hotspots) {
    toTago = toTago.concat(parseHotspots(payload.hotspots, serie));
    payload.hotspots = undefined;
  }

  payload = toTago;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload = payload.filter(
    (x: any) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0),
  );

  return payload as IDeviceData[];
}
