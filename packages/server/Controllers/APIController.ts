import type { IncomingHttpHeaders } from "node:http";
import type { IAccountToken, IDeviceToken } from "@tago-io/tcore-sdk/types";
import type express from "express";
import type { Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { getAccountToken } from "../Services/Account/Account.ts";
import { getDeviceByToken, getDeviceToken } from "../Services/Device.ts";
import { checkMasterPassword } from "../Services/Settings.ts";

type TResourceType = "device" | "account";
type TPermission = "full" | "write" | "read";

interface ISetupToken {
  resource: TResourceType;
  permission: TPermission;
}

interface ISetupTokenAnonymous {
  resource: "anonymous";
  permission: "any";
}

interface ISetupController {
  zBodyParser?: ZodTypeAny;
  zQueryStringParser?: ZodTypeAny;
  zURLParamsParser?: ZodTypeAny;
  allowTokens: (ISetupToken | ISetupTokenAnonymous)[];
}

/**
 */
abstract class APIController<
  BodyParams = any,
  QueryStringParams = any,
  URLParams = any,
> {
  /**
   * Status for Request with Success [default=200].
   */
  protected successStatus = 200;
  /**
   * Status for Request with Error [default=400].
   */
  protected failStatus = 400;
  /**
   * This is the response of the request.
   */
  protected body: any;
  /**
   * Add {status; result; message} on requests [default=true].
   */
  protected useBodyWrapper = true;
  /**
   * This will contain the parsed version of `req.body`.
   */
  protected bodyParams: BodyParams = {} as BodyParams;
  /**
   * This will contain the parsed version of `req.query`.
   */
  protected queryStringParams: QueryStringParams = {} as QueryStringParams;
  /**
   * This will contain the parsed version of `req.params`.
   */
  protected urlParams: URLParams = {} as URLParams;

  protected readonly files: any;
  protected readonly requestIP: string;
  protected readonly origin: string;
  protected readonly rawToken: string | undefined;

  abstract setup: ISetupController;

  /**
   * Main method.
   */
  abstract main(): Promise<void>;

  /**
   * Headers to be sent along with the response.
   */
  private headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Cache-Control, Pragma, X-Requested-With, Authorization, Account-Token, Device-Token, Token",
    "Content-Type": "application/json; charset=utf-8",
  };

  // eslint-disable-next-line no-unused-vars
  constructor(
    protected readonly req: Request,
    protected readonly res: Response,
  ) {
    this.files = (req as any).files;
    this.requestIP = String(
      req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    );
    this.origin = req.headers.origin || "unknown";
    this.rawToken = this.getToken(req.headers);

    this.res.set(this.headers);

    // Send process to next CPU cycle
    setImmediate(() => this.init());
  }

  /**
   * Runs the whole routine.
   */
  private async init() {
    try {
      await this.resolveAuth();
    } catch (ex: any) {
      this.body = ex?.message || undefined;
      this.res.statusCode = 401;
      this.res.json({ status: false, result: this.body });
      return;
    }

    let errorOn = "unknown";
    try {
      if (this.setup.zBodyParser) {
        errorOn = "Body parameters";
        this.bodyParams = await this.setup.zBodyParser.parseAsync(
          this.req.body,
        );
      }

      if (this.setup.zQueryStringParser) {
        errorOn = "Query String parameters";
        this.queryStringParams = await this.setup.zQueryStringParser.parseAsync(
          this.req.query,
        );
      }

      if (this.setup.zURLParamsParser) {
        errorOn = "URL parameters";
        this.urlParams = await this.setup.zURLParamsParser.parseAsync(
          this.req.params,
        );
      }
    } catch (error: any) {
      this.req.statusCode = this.failStatus;

      if (error?.flatten) {
        const zodError = error.flatten()?.fieldErrors;
        this.res.json({
          status: false,
          message: `Error on ${errorOn}`,
          field_errors: zodError,
        });
      } else {
        this.res.json({
          status: false,
          message: `Internal Error (${Date.now()})`,
        });
      }
      return;
    }

    const success = await this.main()
      .then(() => true)
      .catch((e) => {
        this.body = e;
        return false;
      });

    this.res.statusCode = success ? this.successStatus : this.failStatus;

    if (!this.useBodyWrapper) {
      this.res.send(this.body);
      return;
    }

    if (success) {
      this.res.json({ status: true, result: this.body });
    } else {
      if (this.body?.flatten) {
        const zodError = this.body?.flatten()?.fieldErrors;
        this.res.json({
          status: false,
          message: "Error on object parse",
          field_errors: zodError,
        });
      } else if (typeof this.body === "string") {
        this.res.json({ status: false, message: String(this.body) });
      } else if (this.body instanceof Error) {
        this.res.json({ status: false, message: String(this.body.message) });
      } else {
        this.res.json({ status: false, result: this.body });
      }
    }
  }

  /**
   * Validates and resolves account and device tokens.
   */
  private async resolveAuth() {
    let accountToken: IAccountToken | null = null;
    let deviceToken: IDeviceToken | null = null;

    const containAnonymousToken = this.setup.allowTokens.some(
      (x) => x.resource === "anonymous",
    );
    if (containAnonymousToken) {
      // valid by default
      return;
    }

    for (const allowed of this.setup.allowTokens || []) {
      if (allowed.resource === "account") {
        if (!accountToken) {
          accountToken = await getAccountToken(this.rawToken as string).catch(
            () => null,
          );
        }
        if (
          accountToken?.permission === "full" ||
          accountToken?.permission === allowed.permission
        ) {
          // valid permission
          return;
        }
        if (this.req.headers.masterpassword) {
          const matches = await checkMasterPassword(
            this.req.headers.masterpassword as string,
          );
          if (matches) {
            return;
          }
        }
      }
      if (allowed.resource === "device") {
        if (!deviceToken) {
          deviceToken = await getDeviceToken(this.rawToken as string).catch(
            () => null,
          );
        }
        if (
          deviceToken?.permission === "full" ||
          deviceToken?.permission === allowed.permission
        ) {
          // valid permission
          return;
        }
      }
    }

    throw new Error("Authorization denied");
  }

  /**
   */
  private getToken(headers: IncomingHttpHeaders): string | undefined {
    if (!headers || typeof headers !== "object") {
      headers = {};
    }

    let token: any;
    token = token || headers["account-token"];
    token = token || headers["profile-token"];
    token = token || headers["device-token"];
    token = token || headers["public-token"];
    token = token || headers["analysis-token"];
    token = token || headers.token;
    token = token || headers.authorization;
    token = token || headers.authorized;
    token = token || (this.queryStringParams as any).authorization;
    token = token || (this.queryStringParams as any).authorized;
    token = token || (this.queryStringParams as any).account_token;
    token = token || (this.queryStringParams as any).public_token;
    token = token || (this.queryStringParams as any).device_token;
    token = token || (this.queryStringParams as any).token;
    token = token === "null" ? undefined : token;

    return token;
  }

  /**
   * Resolves a device from a token.
   */
  protected async resolveDeviceFromToken() {
    const device = await getDeviceByToken(this.rawToken as string);
    if (!device.active) {
      throw new Error("Device is deactivated");
    }
    return device;
  }

  /**
   * Resolves the request to a string identifying the agent who made the request.
   */
  public resolveAgentString() {
    const userAgent = this.req.get("user-agent") || "Unknown";
    const requestIP = this.requestIP;
    const contentType = this.req.get("content-type") || "Unknown";
    const endToken = String(this.rawToken).slice(-5);
    return `From: ${requestIP} [${userAgent}] - Content-Type: ${contentType} - Token Ending: ${endToken}`;
  }
}

// eslint-disable-next-line no-unused-vars
function warm(APIControllerInstance: {
  new (...args: any): APIController<any, any, any>;
}) {
  return (
    req: express.Request,
    res: express.Response,
    next?: express.NextFunction,
  ) => {
    return new APIControllerInstance(req, res, next);
  };
}

export default APIController;
export { warm, type ISetupToken, type ISetupController };
