import { z } from "zod";

export const zSummary = z.object({
  device: z.number(),
  analysis: z.number(),
  action: z.number(),
});

export type ISummary = z.infer<typeof zSummary>;
