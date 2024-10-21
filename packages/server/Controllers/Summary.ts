import type { Application } from "express";
import { getSummary } from "../Services/Summary.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Retrieves the summary information.
 */
class GetSummaryInfo extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getSummary();
    this.body = response;
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.get("/summary", warm(GetSummaryInfo));
};
