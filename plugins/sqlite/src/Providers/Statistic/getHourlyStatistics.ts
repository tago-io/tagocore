import type { IStatistic } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves all statistics from the current hour.
 */
async function getHourlyStatistics(): Promise<IStatistic[]> {
  const oneHour = 1000 * 60 * 60;
  const start = new Date(new Date().getTime() - oneHour);
  const end = new Date();

  const query = knexClient
    .select("*")
    .from("statistic")
    .whereBetween("time", [start.toISOString(), end.toISOString()]);

  const response = await query;

  for (const item of response) {
    item.time = new Date(item.time);
  }

  return response;
}

export default getHourlyStatistics;
