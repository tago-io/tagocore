import type { IDeviceDataLatLng } from "./toTagoFormat.ts";

interface IInspectObject {
  [key: string]: string | number | boolean | IInspectObject;
}

/**
 * Transforms an object to a TagoIO data array object
 * Works with nested object as value
 *
 * @param objectItem - object data to be parsed
 * @param group - default group for all data
 * @param oldKey - internal use for object values
 * @returns {IDeviceDataLatLng} formatted data
 */
function inspectFormat(
  objectItem: IInspectObject,
  group: string,
  oldKey?: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = [];
  for (const key in objectItem) {
    if (key === "lng".toLowerCase() || key.toLowerCase() === "longitude")
      continue;
    if (key === "lat".toLowerCase() || key.toLowerCase() === "latitude") {
      const lng =
        objectItem.lng || objectItem.longitude || objectItem.Longitude;
      result.push({
        variable: oldKey ? `${oldKey}_location`.toLowerCase() : "location",
        value: `${objectItem[key]}, ${lng}`,
        location: { lat: Number(objectItem[key]), lng: Number(lng) },
        group,
      });
    } else if (typeof objectItem[key] === "object") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result = result.concat(inspectFormat(objectItem[key] as any, group, key));
    } else {
      result.push({
        variable: oldKey
          ? `${oldKey}_${key}`.toLowerCase()
          : `${key}`.toLowerCase(),
        value: objectItem[key],
        group,
      });
    }
  }

  return result as IDeviceDataLatLng[];
}

export default inspectFormat;
export type { IInspectObject };
