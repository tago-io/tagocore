import { z } from "zod";
import { zObjectID } from "../Common/Common.types.ts";

/**
 * Configuration of a inspector connection ID.
 */
export const zLiveInspectorConnectionID = z.string().nullish();

/**
 * Configuration of a message from the device's inspector.
 */
export const zLiveInspectorMessage = z.object({
  connection_id: z.string(),
  content: z.any(),
  device_id: zObjectID,
  timestamp: z.number(),
  title: z.string(),
});

/**
 * Configuration to create a message in the device's inspector.
 */
export const zLiveInspectorMessageCreate = z.object({
  content: z.any(),
  title: z.string(),
});

export type ILiveInspectorMessageCreate = z.infer<typeof zLiveInspectorMessageCreate>;
export type ILiveInspectorMessage = z.infer<typeof zLiveInspectorMessage>;
export type TLiveInspectorConnectionID = z.infer<typeof zLiveInspectorConnectionID>;
