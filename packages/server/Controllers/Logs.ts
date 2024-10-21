import type { Application } from "express";
import { z } from "zod";
import { getLogChannelInfo, getLogChannelList } from "../Services/Logs.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Retrieves all the information of a single log channel.
 */
class GetLogChannelInfo extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const channels = await getLogChannelInfo(this.urlParams.id);
    this.body = channels;
  }
}

/**
 * Lists all the log channels.
 */
class ListLogChannels extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const channels = await getLogChannelList();
    this.body = channels;
  }
}

/**
 * Exports the routes of the logs.
 */
export default (app: Application) => {
  app.get("/logs", warm(ListLogChannels));
  app.get("/logs/:id", warm(GetLogChannelInfo));
};
