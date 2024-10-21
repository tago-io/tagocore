import { z } from "zod";
import { zDateAutoGen } from "../Common/Common.types.ts";

/**
 * Configuration of a log.
 */
export const zLog = z.object({
  timestamp: z.date(),
  message: z.string(),
  error: z.boolean(),
});

/**
 * Configuration to create a log.
 */
export const zLogCreate = zLog.extend({
  timestamp: zDateAutoGen,
});

/**
 * Configuration of the log list.
 */
export const zLogList = z.array(zLog);

export type ILog = z.infer<typeof zLog>;
export type ILogList = z.infer<typeof zLogList>;
export type ILogCreate = z.infer<typeof zLogCreate>;
