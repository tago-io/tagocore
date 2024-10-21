import type { IDatabaseAddStatisticData } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Adds a statistic.
 */
async function addStatistic(
  isoTime: string,
  data: IDatabaseAddStatisticData,
): Promise<void> {
  const time = new Date(isoTime);

  await mainDB.write
    .insert({
      time,
      input: data.input,
      output: data.output,
    })
    .into("statistic")
    .onConflict(["time"])
    .merge({
      input: mainDB.write.raw("statistic.input + values(input)"),
      output: mainDB.write.raw("statistic.output + values(output)"),
    });
}

export default addStatistic;
