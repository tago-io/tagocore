import { core } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkBuild {
  downlinKey: string;
  port: number;
  payload: string;
  url: string;
  confirmed: boolean;
}

/**
 * Send downlink to the device
 *
 * @param body  - params for the downlink
 * @param body.downlinKey  - device eui
 * @param body.port  - port for the downlink
 * @param body.payload  - payload of the request
 * @param body.url  - network server url
 * @param body.confirmed  - confirmed true/false
 */
async function sendDownlink({
  downlinKey,
  port,
  payload,
  url,
  confirmed,
}: IDownlinkBuild) {
  const options: AxiosRequestConfig = {
    url,
    method: "POST",
    headers: { Authorization: `Bearer ${downlinKey}` },
    data: {
      downlinks: [
        {
          frm_payload: payload,
          f_port: port || 1,
          priority: "NORMAL",
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
 * @param classAConfig - optinal parameter sent by TTN for class A devices
 * @returns {any} void
 */
async function downlinkService(
  config: IConfigParam,
  req: Request,
  res: Response,
  classAConfig?: IClassAConfig,
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
  const port = Number(body.port || 1);

  const device = await getDevice(body.device);
  if (!classAConfig?.downlink_key || !classAConfig?.url) {
    const deviceParams = await core.getDeviceParamList(device.id);
    console.log(deviceParams);

    const urlParam = deviceParams.find((param) => param.key === "downlink_url");
    const keyParam = deviceParams.find((param) => param.key === "downlink_key");

    if (!keyParam || !urlParam) {
      return sendResponse(res, {
        body: "Invalid authorization header",
        status: 401,
      });
    }

    classAConfig = {
      downlink_key: keyParam.value as string,
      url: urlParam.value as string,
    };
  }

  const downlinkBuild: IDownlinkBuild = {
    port,
    confirmed: body.confirmed as boolean,
    downlinKey: classAConfig.downlink_key,
    payload: Buffer.from(body.payload, "hex").toString("base64"),
    url: classAConfig.url,
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
