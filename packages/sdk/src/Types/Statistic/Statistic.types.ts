import { z } from "zod";

/**
 * Base configuration of a statistic.
 */
export const zStatistic = z.object({
  input: z.number(),
  output: z.number(),
  time: z.date(),
});

/**
 * Configuration to create a statistic.
 */
export const zStatisticCreate = zStatistic.omit({ time: true }).partial();

export type IStatistic = z.infer<typeof zStatistic>;
export type IStatisticCreate = z.infer<typeof zStatisticCreate>;
