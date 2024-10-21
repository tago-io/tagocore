import type { IDatabaseAddStatisticData } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Adds a statistic.
 */
async function addStatistic(
  isoTime: string,
  data: IDatabaseAddStatisticData,
): Promise<void> {
  await knexClient
    .insert({ time: isoTime, input: data.input, output: data.output })
    .into("statistic")
    .onConflict(["time"])
    .merge({
      input: knexClient.raw("statistic.input + excluded.input"),
      output: knexClient.raw("statistic.output + excluded.output"),
    });
}

export default addStatistic;
