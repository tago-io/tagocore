import type { IStatistic } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all statistics from the current hour.
 */
async function getHourlyStatistics(): Promise<IStatistic[]> {
  const date = new Date();
  const start = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      0,
      0,
    ),
  );

  const end = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours() + 1,
      0,
      0,
    ),
  );

  const response = await mainDB.read
    .select("*")
    .from("statistic")
    .whereBetween("time", [start.toISOString(), end.toISOString()]);

  for (const item of response) {
    item.time = new Date(item.time);
  }

  return response;
}

export default getHourlyStatistics;
