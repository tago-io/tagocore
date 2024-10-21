import type { IDatabaseAddStatisticData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Adds a statistic.
 */
async function addStatistic(
  isoTime: string,
  data: IDatabaseAddStatisticData,
): Promise<void> {
  await mainDB.write
    .insert({
      time: new Date(isoTime),
      input: data.input,
      output: data.output,
    })
    .into("statistic")
    .onConflict(["time"])
    .merge({
      input: mainDB.write.raw("statistic.input + EXCLUDED.input"),
      output: mainDB.write.raw("statistic.output + EXCLUDED.output"),
    });
}

export default addStatistic;
