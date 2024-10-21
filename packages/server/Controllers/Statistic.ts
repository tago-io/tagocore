import type { Application } from "express";
import { getHourlyStatistics } from "../Services/Statistic.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Retrieves all statistics from the last hour.
 */
class GetHourlyStatistic extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getHourlyStatistics();
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/statistics", warm(GetHourlyStatistic));
};
