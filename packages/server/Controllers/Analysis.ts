import {
  type IAnalysisCreate,
  type IAnalysisEdit,
  type IAnalysisListQuery,
  zAnalysisCreate,
  zAnalysisEdit,
  zAnalysisListQuery,
} from "@tago-io/tcore-sdk/types";
import type { Application } from "express";
import { z } from "zod";
import {
  createAnalysis,
  deleteAnalysis,
  deleteAnalysisLogs,
  editAnalysis,
  getAnalysisInfo,
  getAnalysisList,
} from "../Services/Analysis.ts";
import { runAnalysis } from "../Services/AnalysisCodeExecution.ts";
import APIController, { type ISetupController, warm } from "./APIController.ts";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Lists all the analyses.
 */
class ListAnalyses extends APIController<void, IAnalysisListQuery, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zAnalysisListQuery,
  };

  public async main() {
    const response = await getAnalysisList(this.queryStringParams);
    this.body = response;
  }
}

/**
 * Retrieves all the information of a single analysis.
 */
class GetAnalysisInfo extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getAnalysisInfo(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Deletes a single analysis.
 */
class DeleteAnalysis extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await deleteAnalysis(this.urlParams.id);
  }
}

/**
 * Deletes all logs of an analysis.
 */
class DeleteAnalysisLogs extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await deleteAnalysisLogs(this.urlParams.id);
  }
}

/**
 * Runs a single analysis.
 */
class RunAnalysis extends APIController<
  any,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
    zBodyParser: z.any(),
  };

  public async main() {
    await runAnalysis(this.urlParams.id, this.bodyParams?.scope);
  }
}

/**
 * Edits the information of a single analysis.
 */
class EditAnalysis extends APIController<
  IAnalysisEdit,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zAnalysisEdit,
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await editAnalysis(this.urlParams.id, this.bodyParams);
  }
}

/**
 * Creates a new analysis.
 */
class CreateAnalysis extends APIController<IAnalysisCreate, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zAnalysisCreate,
  };

  public async main() {
    const response = await createAnalysis(this.bodyParams);
    this.body = { id: response };
  }
}

/**
 * Exports the routes of the analysis.
 */
export default (app: Application) => {
  app.delete("/analysis/:id/log", warm(DeleteAnalysisLogs));
  app.delete("/analysis/:id", warm(DeleteAnalysis));
  app.get("/analysis/:id/run", warm(RunAnalysis));
  app.post("/analysis/:id/run", warm(RunAnalysis));
  app.get("/analysis", warm(ListAnalyses));
  app.get("/analysis/:id", warm(GetAnalysisInfo));
  app.post("/analysis", warm(CreateAnalysis));
  app.put("/analysis/:id", warm(EditAnalysis));
};
