import type { Application } from "express";
import { z } from "zod";
import { getFileList } from "../Services/FilePicker.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Configuration of a `path` property in the query string.
 */
const zQueryStringPath = z.object({
  path: z.string(),
  local_fs: z.any().optional(),
});

/**
 * Lists all the files.
 */
class GetFileList extends APIController<
  void,
  z.infer<typeof zQueryStringPath>,
  void
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zQueryStringPath,
  };

  public async main() {
    this.body = await getFileList(
      this.queryStringParams.path,
      this.queryStringParams.local_fs,
    );
  }
}

/**
 * Exports the routes of the files.
 */
export default (app: Application) => {
  app.get("/file", warm(GetFileList));
};
