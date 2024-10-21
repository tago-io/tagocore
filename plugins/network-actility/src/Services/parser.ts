import toTagoFormat, { type IDeviceDataLatLng } from "../lib/toTagoFormat.ts";
import type { IPayloadParamsActility } from "./uplink.ts";

/**
 * Decode data from Actility
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(
  payload: Partial<IPayloadParamsActility["DevEUI_uplink"]> & {
    payload?: string;
  },
): Promise<IDeviceDataLatLng[]> {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.DevEUI) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return payload as any;
  }

  const serie = String(new Date().getTime());
  if (payload.payload_hex) {
    payload.payload = payload.payload_hex;
    payload.payload_hex = undefined;
  }
  payload.CustomerData = undefined;
  payload.CustomerID = undefined;
  payload.Lrrs = undefined;
  payload.DevAddr = undefined;
  payload.AppSKey = undefined;
  payload.DynamicClass = undefined;
  payload.InstantPER = undefined;
  payload.MeanPER = undefined;

  let result = toTagoFormat(payload, serie);
  result = result.filter(
    (x) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0),
  );

  return result;
}
