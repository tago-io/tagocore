import { type ITag, zCron, zObjectID } from "@tago-io/tcore-sdk/types";
import { z } from "zod";

/**
 * Validation for the action.
 */
const zFrontAction = z.object({
  type: z.string(),
});

/**
 * Validation for the front-end 'tago-io' action.
 */
const zFrontActionTagoIO = z.object({
  type: z.literal("tagoio"),
  token: z.string().uuid(),
});

/**
 * Validation for the front-end 'post' action.
 */
const zFrontActionPost = z
  .object({
    type: z.literal("post"),
    url: z.string().url().nonempty(),
    headers: z.any(),
    fallback_token: z.string().uuid().nullish(),
    http_post_fallback_enabled: z.any(),
  })
  .transform((x) => {
    if (Array.isArray(x.headers)) {
      const headersObj: { [key: string]: string } = {};
      for (const headerItem of x.headers) {
        headersObj[headerItem.name] = headerItem.value;
      }
      x.headers = headersObj;
    }
    return x;
  });

/**
 * Validation for the front-end conditions of the 'condition' type.
 */
const zFrontConditionDataCondition = z.object({
  variable: z.string().nonempty(),
  value: z.string(),
  second_value: z.string().nonempty().optional(),
  is: z.enum(["<", ">", "=", "!", "><", "*"]).default("*"),
  value_type: z.enum(["string", "number", "boolean"]).default("string"),
  unlock: z.boolean().optional(),
});

/**
 * Validation for the front-end script action.
 */
const zFrontActionScript = z.object({
  type: z.literal("script"),
  script: z.array(zObjectID.or(z.object({ id: zObjectID }))),
});

/**
 * Validation for the front-end conditionData object.
 */
const zFrontConditionDataSingle = z.object({
  type: z.literal("single"),
  device: zObjectID.or(z.object({ id: zObjectID })),
  conditions: z.array(zFrontConditionDataCondition).min(1),
  unlockConditions: z.array(zFrontConditionDataCondition),
});

/**
 * Validation for the front-end conditionData object.
 */
const zFrontConditionDataMultiple = z.object({
  type: z.literal("multiple"),
  tag: z.object({ key: z.string().nonempty(), value: z.string().nonempty() }),
  conditions: z.array(zFrontConditionDataCondition).min(1),
  unlockConditions: z.array(zFrontConditionDataCondition),
});

/**
 * Validation for the front-end interval object.
 */
const zFrontIntervalData = z.object({
  type: z.literal("interval"),
  interval: z.number().int().min(1),
  interval_unit: z.enum([
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "quarter",
    "year",
  ]),
});

/**
 * Validation for the front-end scheduleData object.
 */
const zFrontScheduleData = z.object({
  type: z.literal("schedule"),
  repeat_unit: z.number().int().min(1),
  timezone: z.object({ id: z.string().nonempty() }).or(z.string().nonempty()),
  cron: zCron,
});

/**
 * Intervals allowed for the 'interval' of the schedule data.
 */
type TScheduleDataIntervalUnit =
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";

type TScheduleDataType = "schedule" | "interval";

/**
 * Weekdays for the schedule data.
 */
interface IScheduleDataWeekdays {
  Monday?: boolean;
  Tuesday?: boolean;
  Wednesday?: boolean;
  Thursday?: boolean;
  Friday?: boolean;
  Saturday?: boolean;
  Sunday?: boolean;
}

/**
 * Schedule data exclusive to the front-end.
 * This is used to better manipulate specific schedule data of the action.
 */
interface IScheduleData {
  type?: TScheduleDataType;
  recurrenceType?: "basic" | "advanced";
  canRender?: boolean;
  interval?: string | number;
  interval_unit?: TScheduleDataIntervalUnit;
  repeat_unit?: string | number;
  repeat_type?: string | number;
  repeat_date?: string | number;
  repeat_hour?: string;
  repeat_weekdays?: IScheduleDataWeekdays;
  timezone?: any;
  cron?: string;
}

/**
 * Condition data exclusive to the front-end.
 * This is used to better manipulate specific condition data of the action.
 */
interface IConditionData {
  type?: "single" | "multiple";
  device?: any;
  tag?: ITag;
  conditions?: any[];
  unlockConditions?: any[];
  lock?: boolean;
}

/**
 * Error object of the schedule data.
 */
interface IScheduleDataError {
  interval?: boolean;
  interval_unit?: boolean;
  repeat_unit?: boolean;
  repeat_type?: boolean;
  repeat_date?: boolean;
  repeat_hour?: boolean;
  timezone?: boolean;
  cron?: boolean;
}

export {
  type IConditionData,
  type IScheduleData,
  type IScheduleDataError,
  type IScheduleDataWeekdays,
  type TScheduleDataIntervalUnit,
  type TScheduleDataType,
  zFrontAction,
  zFrontActionTagoIO,
  zFrontActionPost,
  zFrontActionScript,
  zFrontConditionDataMultiple,
  zFrontConditionDataSingle,
  zFrontIntervalData,
  zFrontScheduleData,
};
