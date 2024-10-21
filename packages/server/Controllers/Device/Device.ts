import {
  type IDeviceCreate,
  type IDeviceEdit,
  type IDeviceListQuery,
  type IDeviceParameterCreate,
  type IDeviceTokenListQuery,
  zDeviceCreate,
  zDeviceEdit,
  zDeviceListQuery,
  zDeviceParameterCreate,
  zDeviceTokenListQuery,
} from "@tago-io/tcore-sdk/types";
import type { Application } from "express";
import { z } from "zod";
import {
  createDevice,
  createDeviceToken,
  deleteDevice,
  deleteDeviceToken,
  editDevice,
  getDeviceInfo,
  getDeviceList,
  getDeviceParamList,
  getDeviceTokenList,
  setDeviceParams,
} from "../../Services/Device.ts";
import APIController, {
  type ISetupController,
  warm,
} from "../APIController.ts";

/**
 * Configuration for ID in the URL.
 */
const zURLParamsID = z.object({
  id: z.string(),
});

/**
 * Deletes a token of a device.
 */
class DeleteDeviceToken extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await deleteDeviceToken(this.urlParams.id);
  }
}

/**
 * Overrides or edits device parameters.
 */
class SetDeviceParams extends APIController<
  IDeviceParameterCreate[],
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
    zBodyParser: z.array(zDeviceParameterCreate),
  };

  public async main() {
    await setDeviceParams(this.urlParams.id, this.bodyParams);
  }
}

/**
 * Lists all the tokens of a device.
 */
class GetDeviceParamList extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getDeviceParamList(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Generates and retrieves a new device token.
 */
class CreateDeviceToken extends APIController<any, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: z.any(),
  };

  public async main() {
    const response = await createDeviceToken(
      this.bodyParams?.device,
      this.bodyParams,
    );
    this.body = response;
  }
}

/**
 * Lists all the tokens of a device.
 */
class ListDeviceTokens extends APIController<
  void,
  IDeviceTokenListQuery,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zDeviceTokenListQuery,
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getDeviceTokenList(
      this.urlParams.id,
      this.queryStringParams,
    );
    this.body = response;
  }
}

/**
 * Lists all the devices.
 */
class ListDevices extends APIController<void, IDeviceListQuery, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zQueryStringParser: zDeviceListQuery,
  };

  public async main() {
    const response = await getDeviceList(this.queryStringParams);
    this.body = response;
  }
}

/**
 * Retrieves all the information of a single device.
 */
class GetDeviceInfo extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    const response = await getDeviceInfo(this.urlParams.id);
    this.body = response;
  }
}

/**
 * Deletes a single device.
 */
class DeleteDevice extends APIController<
  void,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await deleteDevice(this.urlParams.id);
  }
}

/**
 * Edits a single device.
 */
class EditDevice extends APIController<
  IDeviceEdit,
  void,
  z.infer<typeof zURLParamsID>
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zDeviceEdit,
    zURLParamsParser: zURLParamsID,
  };

  public async main() {
    await editDevice(this.urlParams.id, this.bodyParams);
  }
}

/**
 * Creates a new device.
 */
class CreateDevice extends APIController<IDeviceCreate, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zDeviceCreate,
  };

  public async main() {
    const response = await createDevice(this.bodyParams);
    this.body = response;
  }
}

/**
 * Exports the routes of the device.
 */
export default (app: Application) => {
  app.delete("/device/:id", warm(DeleteDevice));
  app.get("/device", warm(ListDevices));
  app.get("/device/:id", warm(GetDeviceInfo));
  app.post("/device", warm(CreateDevice));
  app.put("/device/:id", warm(EditDevice));

  app.post("/device/token", warm(CreateDeviceToken));
  app.get("/device/token/:id", warm(ListDeviceTokens));
  app.delete("/device/token/:id", warm(DeleteDeviceToken));

  app.get("/device/:id/params", warm(GetDeviceParamList));
  app.post("/device/:id/params", warm(SetDeviceParams));
};
