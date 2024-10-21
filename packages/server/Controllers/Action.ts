import {
  type IActionCreate,
  type IActionEdit,
  type IActionListQuery,
  zActionCreate,
  zActionEdit,
  zActionListQuery,
} from "@tago-io/tcore-sdk/types";
import type { Application } from "express";
import { z } from "zod";
import {
  createAction,
  deleteAction,
  editAction,
  getActionInfo,
  getActionList,
} from "../Services/Action.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Lists all the actions.
 */
class ListActions extends APIController<void, IActionListQuery, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zActionListQuery,
  };

  public async main() {
    const response = await getActionList(this.queryStringParams);
    this.body = response;
  }
}

/**
 * Retrieves all the information of a single action.
 */
class GetActionInfo extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getActionInfo(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Deletes a single action.
 */
class DeleteAction extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await deleteAction(this.urlParams.id);
  }
}

/**
 * Edits the information of a single action.
 */
class EditAction extends APIController<
  IActionEdit,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zActionEdit,
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await editAction(this.urlParams.id, this.bodyParams);
  }
}

/**
 * Creates a new action.
 */
class CreateAction extends APIController<IActionCreate, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zActionCreate,
  };

  public async main() {
    const response = await createAction(this.bodyParams);
    this.body = { action: response };
  }
}

/**
 * Exports the routes of the action.
 */
export default (app: Application) => {
  app.delete("/action/:id", warm(DeleteAction));
  app.get("/action", warm(ListActions));
  app.get("/action/:id", warm(GetActionInfo));
  app.post("/action", warm(CreateAction));
  app.put("/action/:id", warm(EditAction));
};
