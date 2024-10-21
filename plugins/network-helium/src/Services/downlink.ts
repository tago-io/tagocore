import { core } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkBuild {
  port: number;
  payload: string;
  url: string;
  confirmed: boolean;
}

/**
 * send downlink to the network server
 *
 * @param dowlinkBuild - object with downlink params
 * @param dowlinkBuild.port - port for the downlink
 * @param dowlinkBuild.payload - payload in base64
 * @param dowlinkBuild.url - url for the downlink
 * @param dowlinkBuild.confirmed - confirmed for the downlink
 */
async function sendDownlink({ port, payload, url, confirmed }: IDownlinkBuild) {
  const options: AxiosRequestConfig = {
    url,
    method: "POST",
    data: { payload_raw: payload, port, confirmed },
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

  const body = <IDownlinkParams>req.body;
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

  const port = Number(body.port || 1);

  const device = await getDevice(body.device);
  if (!device) {
    return sendResponse(res, {
      body: `Downlink error, device not found ${body.device}`,
      status: 401,
    });
  }

  const params = await core.getDeviceParamList(device.id);
  const downlinkStringParam = params.find(
    (param) => param.key === "downlink_string",
  );
  if (!downlinkStringParam) {
    return sendResponse(res, {
      body: `Downlink error, device ${body.device} must perform an uplink first in order to collect API downlink settings`,
      status: 401,
    });
  }

  const downlinkBuild: IDownlinkBuild = {
    port,
    confirmed: body.confirmed as boolean,
    payload: Buffer.from(body.payload, "hex").toString("base64"),
    url: downlinkStringParam.value,
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
