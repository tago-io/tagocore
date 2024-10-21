import inspectFormat from "../lib/inspectFormat.ts";
import toTagoFormat, {
  type IDeviceDataLatLng,
  type IToTagoObject,
} from "../lib/toTagoFormat.ts";
import type { IEverynetObject } from "./IEverynetObject.ts";

/**
 * In the solutions params is where usually latitude and longitude for your antenna signal comes from.
 *
 * @param {Object} solutions - gateway object from everynet
 * @param {string | number} serie - serie for the variables
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
function transformSolutionParam(
  solutions: IEverynetObject["params"]["solutions"],
  serie: string,
) {
  let toTago: IDeviceDataLatLng[] = [];
  for (const s of solutions) {
    let fixedJSON: IToTagoObject = {};
    fixedJSON.gw_location = {
      value: `${s.lat}, ${s.lng}`,
      location: { lat: s.lat, lng: s.lng },
    };
    // delete s.lat;
    // delete s.lng;

    fixedJSON = { ...fixedJSON, ...s };
    toTago = toTago.concat(toTagoFormat(fixedJSON, serie));
  }

  return toTago;
}

/**
 * Decode data from Everynet
 *
 * @param payload - any payload sent by the device
 * @returns {IDeviceDataLatLng[]} data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload.params) {
    return payload;
  }

  let toTago: IDeviceDataLatLng[] = [];
  const serie = String(new Date().getTime());

  // Get a unique serie for the incoming data.
  if (payload.params.solutions) {
    toTago = toTago.concat(
      transformSolutionParam(payload.params.solutions, serie),
    );
    payload.params.solutions = undefined;
  }

  if (payload.meta) {
    toTago = toTago.concat(toTagoFormat(payload.meta, serie));
    payload.meta = undefined;
  }

  if (payload.params.radio) {
    toTago = toTago.concat(inspectFormat(payload.params.radio, serie));
    payload.params.radio = undefined;
  }

  if (payload.params) {
    if (payload.params.payload) {
      payload.params.payload = Buffer.from(
        payload.params.payload,
        "base64",
      ).toString("hex");
    }

    toTago = toTago.concat(inspectFormat(payload.params, serie));
    payload.params = undefined;
  }

  return toTago;
}
