import { core } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkBuild {
  deviceEUI: string;
  port: number;
  payload: string;
  url: string;
  confirmed: boolean;
}

/**
 * Send downlink to the device
 *
 * @param body  - params for the downlink
 * @param body.deviceEUI  - device eui
 * @param body.port  - port for the downlink
 * @param body.payload  - payload of the request
 * @param body.url  - network server url
 * @param body.confirmed  - confirmed true/false
 */
async function sendDownlink({
  deviceEUI,
  port,
  payload,
  url,
  confirmed,
}: IDownlinkBuild) {
  const options: AxiosRequestConfig = {
    url,
    method: "POST",
    data: {
      msgId: String(new Date().getTime()),
      devEUI: String(deviceEUI),
      confirmed: confirmed || false,
      data: JSON.stringify({ params: { data: payload, port: Number(port) } }),
    },
  };

  await axios(options);
}

interface IDownlinkParams {
  device: string;
  payload: string;
  port: number;
  confirmed: boolean;
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
 * @returns {void}
 */
async function downlinkService(
  config: IConfigParam,
  req: Request,
  res: Response,
) {
  const authorization =
    req.headers["authorization-code"] ||
    req.headers.Authorization ||
    req.headers.authorization;
  if (!authorization || authorization !== config.authorization_code) {
    console.error(
      `[Network Server] Request refused, authentication is invalid: ${authorization}`,
    );
    return sendResponse(res, {
      body: "Invalid authorization header",
      status: 401,
    });
  }

  const body = <IDownlinkParams>req.body;
  const port = Number(body.port || 1);

  if (!body.device) {
    return sendResponse(res, {
      body: "Missing device paramater with device eui as value",
      status: 400,
    });
  }
  if (!body.port) {
    return sendResponse(res, { body: "Missing port paramater", status: 400 });
  }
  if (!body.payload) {
    return sendResponse(res, {
      body: "Missing payload paramater with hexadecimal value",
      status: 400,
    });
  }

  const device = await getDevice(body.device);

  const downlinkBuild: IDownlinkBuild = {
    port,
    confirmed: body.confirmed as boolean,
    deviceEUI: body.device,
    payload: Buffer.from(body.payload, "hex").toString("base64"),
    url: `${config.url}${config.url_path}`,
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
      console.log(
        `[Tektelic Dn-error ${e.response.status}] ${JSON.stringify(e.response.data)}`,
      );
      return sendResponse(res, {
        body: JSON.stringify(e.response.data),
        status: e.response.status,
      });
    });
}

export default downlinkService;
export type { IClassAConfig, IDownlinkParams };
