import { core } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkBuild {
  token: string;
  port: number;
  payload: string;
  url: string;
  confirmed: boolean;
  priority?: string;
}

/**
 * Set downlink settings to configuration parameters of the device
 * Everynet will make its own request to get the information
 */
async function sendDownlink({
  token,
  port,
  payload,
  url,
  confirmed,
  priority,
}: IDownlinkBuild) {
  const options: AxiosRequestConfig = {
    url,
    method: "POST",
    headers: { Authorization: token },
    data: {
      downlinks: [
        {
          frm_payload: payload,
          f_port: port || 1,
          priority: priority || "NORMAL",
          confirmed: confirmed || false,
        },
      ],
    },
  };

  await axios(options);
}

interface IDownlinkParams {
  device: string;
  payload: string;
  port: number;
  confirmed?: boolean;
  priority?: string;
}
interface IClassAConfig {
  downlink_key: string;
  url: string;
}

/**
 * Send downlink to the device in the Network server
 *
 * @param config - Plugin configuration
 * @param req - request
 * @param res - request response
 */
async function downlinkService(
  config: IConfigParam,
  req: Request,
  res: Response,
) {
  const authorization = req.headers.Authorization || req.headers.authorization;
  if (!authorization || authorization !== config.authorization_code) {
    console.error(
      `[Network Server] Request refused, authentication is invalid: ${authorization}`,
    );
    return sendResponse(res, {
      body: "Invalid authorization header",
      status: 401,
    });
  }

  if (!config.downlink_token || !config.url) {
    return sendResponse(res, {
      body: "Chiprstack URL and Token is not set in the Plugin page",
      status: 401,
    });
  }

  const body = <IDownlinkParams>req.body;
  const port = Number(body.port || 1);

  const device = await getDevice(body.device);

  if (!config.downlink_token?.toLowerCase().includes("Bearer")) {
    config.downlink_token = `Bearer ${config.downlink_token}`;
  }

  config.url = config.url.toLowerCase();

  if (!config.url.includes("http://") || !config.url.includes("https://")) {
    // Usually chirpstack server is running locally
    config.url = `http://${config.url}`;
  }

  const downlinkBuild: IDownlinkBuild = {
    port,
    confirmed: body.confirmed as boolean,
    token: `Bearer ${config.downlink_token}`,
    payload: Buffer.from(body.payload, "hex").toString("base64"),
    url: config.url,
  };

  core.emitToLiveInspector(device.id, {
    title: "Downlink HTTP Request",
    content: body,
  });

  return sendDownlink(downlinkBuild)
    .then(() => {
      return sendResponse(res, {
        body: { status: true, message: "Downlink successfully sent" },
        status: 201,
      });
    })
    .catch((e) => {
      return sendResponse(res, {
        body: JSON.stringify(e.response.data),
        status: e.response.status,
      });
    });
}

export default downlinkService;
export type { IClassAConfig, IDownlinkParams };
