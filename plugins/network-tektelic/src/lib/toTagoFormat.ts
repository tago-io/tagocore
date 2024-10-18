import type { IDeviceDataCreate } from "@tago-io/tcore-sdk/Types";

interface IDeviceDataLatLng extends Omit<IDeviceDataCreate, "location"> {
  location?: { lat: number; lng: number };
}
interface IToTagoObject {
  [key: string]: string | number | boolean | IToTagoObject;
}

const fixVariable = (variable: string) =>
  variable.replace(/ /g, "_").toLowerCase();
/**
 * Transforms an object to a TagoIO data array object
 *
 * @param objectItem - object data to be parsed
 * @param group - default group for all data
 * @param prefix - internal use for object values
 * @returns {IDeviceDataLatLng} formatted data
 */
function toTagoFormat(objectItem: IToTagoObject, group?: string, prefix = "") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const objectItemCopy: any = objectItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const key in objectItemCopy) {
    if (typeof objectItem[key] === "object") {
      result.push({
        variable: fixVariable(
          objectItemCopy[key].variable || `${prefix}${key}`,
        ),
        value: objectItemCopy[key].value,
        group: objectItemCopy[key].serie || group,
        metadata: objectItemCopy[key].metadata,
        location: objectItemCopy[key].location,
        unit: objectItemCopy[key].unit,
      });
    } else {
      result.push({
        variable: fixVariable(`${prefix}${key}`),
        value: objectItemCopy[key],
        group,
      });
    }
  }

  return result as IDeviceDataLatLng[];
}

export default toTagoFormat;
export type { IToTagoObject, IDeviceDataLatLng };