import {
  type IStatistic,
  type IStatisticCreate,
  zStatistic,
} from "@tago-io/tcore-sdk/types";
import { DateTime } from "luxon";
import { z } from "zod";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import { io } from "../Socket/SocketServer.ts";

/**
 * Retrieves the summary information.
 */
export const addStatistic = async (data: IStatisticCreate): Promise<void> => {
  const time = DateTime.utc().startOf("minute").toJSDate().toISOString();
  data.input = data.input || 0;
  data.output = data.output || 0;

  await invokeDatabaseFunction("addStatistic", time, data);

  io?.to("statistic").emit("statistic::hourly", { time, ...data });
};

/**
 * Retrieves all statistics from the last hour.
 */
export async function getHourlyStatistics(): Promise<IStatistic[]> {
  const statistics = await invokeDatabaseFunction("getHourlyStatistics");
  const parsed = await z.array(zStatistic).parseAsync(statistics);
  return parsed;
}
