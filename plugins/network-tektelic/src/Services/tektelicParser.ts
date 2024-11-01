import inspectFormat from "../lib/inspectFormat.ts";
import toTagoFormat, { type IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

/**
 * Decode data from Tektelic
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.payloadMetaData) {
    return payload;
  }

  const serie = String(new Date().getTime());
  let toTago: IDeviceDataLatLng[] = [];

  if (payload.payloadMetaData) {
    payload.payloadMetaData.deviceMetaData = undefined;
    payload.payloadMetaData.applicationMetaData = undefined;
    payload.payloadMetaData.gatewayMetaDataList[0].id = undefined;
    payload.payloadMetaData.gatewayMetaDataList[0].name = undefined;
    payload.payloadMetaData.gatewayMetaDataList[0].gtw_id =
      payload.payloadMetaData.gatewayMetaDataList[0].mac;
    payload.payloadMetaData.gatewayMetaDataList[0].mac = undefined;

    payload.payloadMetaData.gatewayMetaDataList[0].gtw = {
      altitude: payload.payloadMetaData.gatewayMetaDataList[0].altitude,
      latitude: payload.payloadMetaData.gatewayMetaDataList[0].latitude,
      longitude: payload.payloadMetaData.gatewayMetaDataList[0].longitude,
    };

    payload.payloadMetaData.gatewayMetaDataList[0].altitude = undefined;
    payload.payloadMetaData.gatewayMetaDataList[0].latitude = undefined;
    payload.payloadMetaData.gatewayMetaDataList[0].longitude = undefined;

    toTago = toTago.concat(
      inspectFormat(payload.payloadMetaData.gatewayMetaDataList[0], serie),
    );
    payload.payloadMetaData.gatewayMetaDataList[0] = undefined;
    toTago = toTago.concat(inspectFormat(payload.payloadMetaData, serie));
    payload.payloadMetaData = undefined;
  }
  // Parse the payload_fields. Go to inspectFormat function if you need to change something.
  if (payload.payload) {
    if (payload.payload.data) {
      payload.payload.payload = payload.payload.data;
      payload.payload.data = undefined;
    }
    if (payload.payload.payload_hex) {
      payload.payload.payload = payload.payload.payload_hex;
      payload.payload.payload_hex = undefined;
    }

    if (payload.payload.bytes) {
      payload.payload.payload = payload.payload.bytes;
      payload.payload.bytes = undefined;
    }

    if (payload.payload?.payload?.includes("[")) {
      payload.payload.payload = Buffer.from(
        JSON.parse(payload.payload.payload),
      ).toString("hex");
    }

    toTago = toTago.concat(toTagoFormat(payload.payload, serie));
  }
  toTago = toTago.filter(
    (x) =>
      !x.location ||
      (x.location &&
        x.location.lat !== 0 &&
        x.location.lng !== 0 &&
        !Number.isNaN(x.location.lat) &&
        !Number.isNaN(x.location.lng)),
  );

  return toTago;
}
