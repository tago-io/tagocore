import crypto from "node:crypto";
import { core } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import { DateTime } from "luxon";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkBuild {
  url: string;
  params: {
    DevEUI: string;
    FPort: number;
    FCntDn: number;
    Payload: string;
    AS_ID: string;
    Time: string;
    Token: string;
  };
}

/**
 * Set downlink settings to configuration parameters of the device
 * Actility will make its own request to get the information
 */
async function sendDownlink({ url, params }: IDownlinkBuild) {
  const options: AxiosRequestConfig = {
    url,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    params,
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
  fcntdn?: number;
  as_id?: string;
}

/**
 * Send downlink to the device in the Network server
 *
 * @param config - Plugin configuration
 * @param req - request
 * @param res - request response
 * @param classAConfig - optinal parameter sent by Actlity for class A devices
 * @returns {void}
 */
async function downlinkService(
  config: IConfigParam,
  req: Request,
  res: Response,
  classAConfig: IClassAConfig = {},
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

  const device = await getDevice(body.device);
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

  if (!classAConfig?.fcntdn || !classAConfig?.as_id) {
    const deviceParams = await core.getDeviceParamList(device.id);

    const asIDParam = deviceParams.find((param) => param.key === "as_id");
    const fctdnParam = deviceParams.find((param) => param.key === "fctdn");

    if (!asIDParam || !fctdnParam) {
      return sendResponse(res, {
        body: "Invalid authorization header",
        status: 401,
      });
    }

    classAConfig.fcntdn = Number(fctdnParam.value as string);
    classAConfig.as_id = asIDParam.value as string;
  }

  const deveui = String(device).toUpperCase();
  const time = DateTime.utc()
    .setZone("America/Sao_Paulo")
    .plus({ seconds: 5 })
    .toFormat("YYYY-MM-DDTHH:mm:ss.SZ");
  const tokenString = `DevEUI=${deveui}&FPort=${body.port}&FCntDn=${classAConfig.fcntdn}&Payload=${
    body.payload
  }&AS_ID=${classAConfig.as_id}&Time=${time}${config.tunnel_key.toLowerCase()}`;
  const token = crypto.createHash("sha256").update(tokenString).digest("hex");

  const downlinkBuild: IDownlinkBuild = {
    url: "https://community.thingpark.io/thingpark/lrc/rest/downlink",
    params: {
      DevEUI: deveui,
      FPort: body.port,
      FCntDn: classAConfig.fcntdn,
      Payload: body.payload,
      AS_ID: classAConfig.as_id,
      Time: time,
      Token: token,
    },
  };

  core.emitToLiveInspector(device.id, {
    title: "Downlink HTTP Request",
    content: body,
  });

  await sendDownlink(downlinkBuild)
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
