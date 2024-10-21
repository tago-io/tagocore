import { z } from "zod";

export const zTag = z.object({
  key: z.string(),
  value: z.string(),
});

export const zTags = z.array(zTag);

export type ITag = z.infer<typeof zTag>;
