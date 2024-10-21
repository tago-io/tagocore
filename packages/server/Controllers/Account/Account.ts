import { type IAccountCreate, zAccountCreate } from "@tago-io/tcore-sdk/types";
import type { Application } from "express";
import { z } from "zod";
import {
  createAccount,
  getAccountByToken,
  login,
} from "../../Services/Account/Account.ts";
import APIController, {
  type ISetupController,
  warm,
} from "../APIController.ts";

const zAccountLoginBody = z.object({
  username: z.string(),
  password: z.string(),
});

/**
 * Lists all the database plugins.
 */
class AccountLogin extends APIController<
  z.infer<typeof zAccountLoginBody>,
  void,
  void
> {
  setup: ISetupController = {
    allowTokens: [{ permission: "any", resource: "anonymous" }],
    zBodyParser: zAccountLoginBody,
  };

  public async main() {
    const { username, password } = this.bodyParams;
    const response = await login(username, password);
    this.body = response;
  }
}

/**
 * Checks if there is at least one account registered.
 */
class InfoAccount extends APIController<void, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "read", resource: "account" }],
  };

  public async main() {
    const response = await getAccountByToken(this.rawToken as string);
    this.body = response;
  }
}

/**
 * Creates a new device.
 */
class CreateAccount extends APIController<IAccountCreate, void, void> {
  setup: ISetupController = {
    allowTokens: [{ permission: "write", resource: "account" }],
    zBodyParser: zAccountCreate,
  };

  public async main() {
    const response = await createAccount(this.bodyParams);
    this.body = response;
  }
}

/**
 * Exports the auth routes.
 */
export default (app: Application) => {
  app.get("/account", warm(InfoAccount));
  app.post("/account", warm(CreateAccount));
  app.post("/account/login", warm(AccountLogin));
};
