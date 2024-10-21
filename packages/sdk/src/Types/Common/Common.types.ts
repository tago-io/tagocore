import { z } from "zod";
import { DateTime } from "luxon";
import cronParser from "cron-parser";
import preprocessNumber from "../Helpers/preprocessNumber.ts";
import { generateResourceID } from "../../Shared/ResourceID.ts";
import { zTag } from "../Tag/Tag.types.ts";
import { parseSafe } from "../Helpers/parseSafe.ts";
import createQueryOrderBy from "../Helpers/createQueryOrderBy.ts";
import { parseRelativeDate } from "../Helpers/parseRelativeDate.ts";

/**
 * Validation for relative date intervals, such as "1 minute", or "30 hours".
 * The minimum allowed value is 1 minute.
 */
export const zInterval = z.string().refine((value) => {
  try {
    const currentDate = new Date();
    const time = parseRelativeDate(value, "plus", currentDate);
    if (!time) {
      return false;
    }
    const diff = DateTime.now().diff(DateTime.fromJSDate(new Date(time)), "minutes").minutes;
    if (diff < 1) {
      return false;
    }
  } catch (ex) {
    return false;
  }
  return true;
}, "Invalid interval");

/**
 * Validation for a cron field, such as "* * * * *".
 */
export const zCron = z.string().refine((value) => {
  try {
    cronParser.parseExpression(value);
    return true;
  } catch {
    return false;
  }
}, "Invalid cron code");

/**
 * Configuration to query a list.
 */
export const zQuery = z.object({
  page: z
    .preprocess(preprocessNumber, z.number())
    .nullish()
    .transform((x) => x ?? 1),
  amount: z
    .preprocess(preprocessNumber, z.number())
    .nullish()
    .transform((x) => x ?? 20)
    .transform((x) => Math.max(x, 0)),
  fields: z
    .array(z.string())
    .nullish()
    .transform((x) => x ?? []),
  filter: z
    .any()
    .nullish()
    .refine((x) => x === null || x === undefined || typeof x === "object", "Filter must be an object")
    .transform((x) => parseSafe(x, {}))
    .refine((x) => !Array.isArray(x), "Filter must be an object"),
  orderBy: createQueryOrderBy(z.string()),
});

/**
 * Configuration of a name field.
 */
export const zName = z.string().min(3).max(100);

/**
 * MD5 hash of the plugin name.
 */
export const zPluginID = z.string();

/**
 * Configuration of an ID field.
 */
export const zObjectID = z.string();

/**
 * Configuration of an auto-generated id when parsed.
 */
export const zObjectIDAutoGen = z
  .string()
  .nullish()
  .transform(() => generateResourceID());

/**
 * Configuration of a token field.
 */
export const zToken = z.string();

/**
 * For auto-generated date fields.
 * This zod field will acquire the current date when parsed.
 */
export const zDateAutoGen = z
  .date()
  .nullish()
  .transform(() => new Date()); // use transform instead of `default` because `default` doesn't apply to `null`.

/**
 * For `active` fields.
 * This zod field will set `false` as default if the active is null or undefined.
 */
export const zActiveAutoGen = z
  .boolean()
  .nullish()
  .transform((e) => e ?? true); // use transform instead of `default` because `default` doesn't apply to `null`.

/**
 * For `tags` fields.
 * This zod field will set [] as default if the tags are null or undefined.
 */
export const zTagsAutoGen = z
  .array(zTag)
  .nullish()
  .transform((e) => e ?? []); // use transform instead of `default` because `default` doesn't apply to `null`.

/**
 * Environment variables for the application.
 */
export const zEnvironmentVariables = z.object({
  TCORE_PORT: z.string().nullish(),
  TCORE_DAEMON: z.string().nullish(),
  TCORE_PLUGIN_FOLDER: z.string().nullish(),
  TCORE_SETTINGS_FOLDER: z.string().nullish(),
  TCORE_DATABASE_PLUGIN: z.string().nullish(),
});

export type IEnvironmentVariables = z.infer<typeof zEnvironmentVariables>;
export type TGenericID = string;
export type TGenericToken = string;
export type TDate = Date | number | null;
export type IQuery = z.input<typeof zQuery>;
