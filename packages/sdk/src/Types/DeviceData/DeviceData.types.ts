import { DateTime } from "luxon";
import { z } from "zod";
import { generateResourceID } from "../../Shared/ResourceID.ts";
import { zObjectID } from "../Common/Common.types.ts";
import {
  convertDateToISO,
  parseRelativeDate,
} from "../Helpers/parseRelativeDate.ts";
import removeNullValues from "../Helpers/removeNullValues.ts";

/**
 * Checks if a given value is indeed a date or not.
 */
function isDate(date: any): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Handles absolute/relative dates.
 * @returns {Date} a date object.
 */
function handleDates(
  rawDate: Date | string,
  timezone: string,
  type: "start" | "end",
): Date {
  let date: Date | "never" | undefined = new Date(rawDate);

  if (!isDate(date)) {
    try {
      date = parseRelativeDate(date, type === "start" ? "minus" : "plus");
    } catch (ex) {
      throw new Error(`Invalid ${type} date`);
    }
  } else {
    try {
      if (String(rawDate).length <= 10) {
        if (type === "start") {
          date = DateTime.fromJSDate(new Date(date)).startOf("day").toJSDate();
        } else {
          date = DateTime.fromJSDate(new Date(date)).endOf("day").toJSDate();
        }
      }
    } catch (error) {
      throw new Error(`Invalid ${type} date`);
    }

    if (timezone) {
      date = new Date(convertDateToISO(date, timezone));
    }
  }

  if (!isDate(date)) {
    throw new Error(`Invalid ${type} date`);
  }

  return date;
}

/**
 * Configuration of location with array coordinates.
 */
const zDeviceDataLocationCoordinates = z.object({
  type: z
    .string()
    .nullish()
    .transform((x) => x || "Point"),
  coordinates: z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
});

/**
 * Configuration of location with object coordinates.
 */
const zDeviceDataLocationLatLng = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Configuration of a single device data.
 */
export const zDeviceData = z.object({
  created_at: z.date().optional(),
  id: zObjectID,
  device: zObjectID.nullish(),
  location: zDeviceDataLocationCoordinates.optional(),
  metadata: z.object({}).catchall(z.any()).or(z.array(z.any())).optional(),
  group: z.string().max(24).nullish(),
  serie: z.number().or(z.string()).optional(),
  time: z.date(),
  unit: z.string().optional(),
  value: z.string().or(z.boolean()).or(z.number()).optional(),
  variable: z.string(),
});

export const zDeviceImmutableData = zDeviceData.extend({
  chunk_timestamp_start: z.date(),
  chunk_timestamp_end: z.date(),
});

/**
 * Configuration to set a location to create a new device data.
 */
const zDeviceDataCreateLocation = zDeviceDataLocationCoordinates
  .or(zDeviceDataLocationLatLng)
  .nullish()
  .transform((x: any): IDeviceDataLocationCoordinates | undefined => {
    if (!x) {
      return undefined;
    }
    if (Array.isArray(x.coordinates)) {
      return x;
    }
    return { type: "Point", coordinates: [x.lng, x.lat] };
  });

/**
 * Configuration to create a new device data.
 */
export const zDeviceDataCreate = zDeviceData
  .omit({ created_at: true, id: true, device: true })
  .extend({
    location: zDeviceDataCreateLocation,
    time: z.preprocess(
      (x) => (x ? new Date(x as string) : undefined),
      z.date().nullish(),
    ),
  })
  .transform((data) => {
    const now = new Date();
    return removeNullValues({
      ...data,
      created_at: now,
      id: generateResourceID(),
      time: data.time || now,
    });
  });

/**
 * Configuration to update a device data.
 */
export const zDeviceDataUpdate = zDeviceData
  .omit({ created_at: true, variable: true, device: true })
  .extend({
    location: zDeviceDataCreateLocation,
    time: z.preprocess(
      (x) => (x ? new Date(x as string) : undefined),
      z.date().nullish(),
    ),
  });

/**
 * Configuration to query the device data list.
 */
export const zDeviceDataQuery = z.preprocess(
  (x: any) => {
    const data: any = {
      end_date: x.end_date,
      ids: x.ids,
      ordination: x.ordination,
      qty: x.qty,
      query: x.query,
      skip: x.skip,
      groups: x.groups,
      start_date: x.start_date,
      values: x.values,
      variables: x.variables,
      timezone: x.timezone,
    };

    if (x.detail || x.details) {
      data.details = true;
    }
    if (x.skip && typeof x.skip !== "boolean") {
      data.skip = Number(x.skip);
    }
    if (x.qty && typeof x.qty !== "boolean") {
      data.qty = Number(x.qty);
    }
    if (x.start_date && typeof x.start_date !== "boolean") {
      data.start_date = handleDates(x.start_date, data.timezone, "start");
    }
    if (x.end_date && typeof x.end_date !== "boolean") {
      data.end_date = handleDates(x.end_date, data.timezone, "end");
    }
    if (x.variables || x.variable) {
      data.variables = [x.variables || x.variable].flat();
    }
    if (x.series || x.serie) {
      data.groups = [x.series || x.serie].flat();
    }
    if (x.groups || x.group) {
      data.groups = [x.groups || x.group].flat();
    }
    if (x.values || x.value) {
      data.values = [x.values || x.value].flat();
    }
    if (x.ids || x.id) {
      data.ids = [x.ids || x.id].flat();
    }

    return removeNullValues(data);
  },
  z.object({
    details: z.boolean().nullish(),
    end_date: z.date().nullish(),
    ids: z.array(z.string()).nullish(),
    query: z
      .enum([
        "last_value",
        "last_location",
        "last_item",
        "last_insert",
        "first_value",
        "first_location",
        "first_item",
        "first_insert",
        "count",
        "max",
        "min",
        "avg",
        "sum",
        "defaultQ",
      ])
      .nullish()
      .transform((x) => x || "defaultQ"),
    groups: z.array(z.string()).nullish(),
    start_date: z.date().nullish(),
    values: z
      .array(z.string())
      .or(z.array(z.boolean()))
      .or(z.array(z.number()))
      .nullish(),
    variables: z.array(z.string()).nullish(),
    skip: z
      .number()
      .min(0)
      .nullish()
      .transform((x) => x ?? 0),
    qty: z
      .number()
      .min(0)
      .max(10000)
      .nullish()
      .transform((x) => x ?? 15),
    ordination: z
      .enum(["ASC", "DESC", "asc", "desc"])
      .nullish()
      .transform((x) => String(x || "DESC").toLowerCase()),
  }),
);

const zDeviceAddDataOptions = z.object({
  rawPayload: z.any().nullish(),
  liveInspectorID: z.string().nullish(),
});

export type IDeviceAddDataOptions = z.infer<typeof zDeviceAddDataOptions>;
export type IDeviceData = z.infer<typeof zDeviceData>;
export type IDeviceDataCreate = z.input<typeof zDeviceDataCreate>;
export type IDeviceDataCreateLocation = z.input<
  typeof zDeviceDataCreateLocation
>;
export type IDeviceDataLocationCoordinates = z.input<
  typeof zDeviceDataLocationCoordinates
>;
export type IDeviceDataLocationLatLng = z.input<
  typeof zDeviceDataLocationLatLng
>;
export type IDeviceDataQuery = z.input<typeof zDeviceDataQuery>;
export type IDeviceDataUpdate = z.input<typeof zDeviceDataUpdate>;
