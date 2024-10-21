import inspectFormat, { type IInspectObject } from "../lib/inspectFormat.ts";
import toTagoFormat, { type IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

/**
 * Decode data from TTN
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ttnParser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.end_device_ids) {
    return payload;
  }

  let toTago: IInspectObject = {};
  const serie = String(new Date().getTime());

  if (payload.location_solved) {
    toTago.location = {
      value: `${payload.location_solved.location.latitude},${payload.location_solved.location.longitude}`,
      location: {
        lat: payload.location_solved.location.latitude,
        lng: payload.location_solved.location.longitude,
      },
    };
    toTago.accuracy = payload.location_solved.location.accuracy;
    toTago.source = payload.location_solved.location.source;
  }

  if (payload.uplink_message) {
    payload = payload.uplink_message;

    toTago.fport = payload.f_port;
    toTago.fcnt = payload.f_cnt;
    toTago.payload = Buffer.from(payload.frm_payload, "base64").toString("hex");
  }

  if (payload.rx_metadata?.length) {
    const rxMetadata = payload.rx_metadata[0];
    toTago.gateway_eui = rxMetadata.gateway_ids.eui;
    toTago.rssi = rxMetadata.rssi;
    toTago.snr = rxMetadata.snr;
    if (rxMetadata.location?.latitude && rxMetadata.location.longitude) {
      const lat = rxMetadata.location.latitude;
      const lng = rxMetadata.location.longitude;
      toTago.gateway_location = {
        value: `${lat},${lng}`,
        location: { lat, lng },
      };
    }

    payload.rx_metadata = undefined;
  }

  let decoded: IDeviceDataLatLng[] = [];
  if (payload.decoded_payload && Object.keys(payload.decoded_payload).length) {
    decoded = inspectFormat(payload.decoded_payload, serie);
    toTago = {
      ...toTago,
      frm_payload: Buffer.from(payload.frm_payload, "base64").toString("hex"),
    };
    toTago.payload = undefined;
  }

  if (payload.settings) {
    decoded = decoded.concat(inspectFormat(payload.settings, serie));
  }

  decoded = decoded.concat(toTagoFormat(toTago, serie));
  decoded = decoded.filter(
    (x) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0),
  );

  return decoded;
}
