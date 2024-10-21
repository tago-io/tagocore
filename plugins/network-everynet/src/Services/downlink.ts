import { core, helpers } from "@tago-io/tcore-sdk";
import axios, { type AxiosRequestConfig } from "axios";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IDownlinkParams {
  device: string;
  payload: string;
  port: number;
  confirmed: boolean;
  authorization?: string;
}

/**
 * Set downlink settings to configuration parameters of the device
 * Everynet will make its own request to get the information
 *
 * @param body  - params for the downlink
 * @param deviceID - device ID
 * @returns {void}
 */
async function setDeviceDownlinkParams(
  body: IDownlinkParams,
  deviceID: string,
) {
  const deviceParams = await core.getDeviceParamList(deviceID);

  const defaultParamSettings = (key) => {
    const index = deviceParams.push({
      key,
      value: "",
      id: helpers.generateResourceID(),
    });
    return deviceParams[index - 1];
  };
  const downlinkParam =
    deviceParams.find((x) => x.key === "downlink") ||
    defaultParamSettings("downlink");
  const fportParam =
    deviceParams.find((x) => x.key === "port") || defaultParamSettings("port");
  const confirmedParam =
    deviceParams.find((x) => x.key === "confirmed") ||
    defaultParamSettings("confirmed");

  downlinkParam.value = String(body.payload);
  fportParam.value = String(body.port);
  confirmedParam.value = String(body.confirmed);

  await core.setDeviceParams(deviceID, deviceParams);
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

  const device = await getDevice(body.device);
  await setDeviceDownlinkParams(body, device.id);

  const url = `https://adapters.ns.${config.region}.everynet.io/http2/cb/${config.conn_id}`;
  const request: AxiosRequestConfig = {
    url,
    method: "POST",
    headers: {
      Authorization: authorization || (body.authorization as string),
    },
    data: {
      meta: {
        device: body.device,
      },
      type: "downlink_claim",
    },
  };

  core.emitToLiveInspector(device.id, {
    title: "Downlink HTTP Request",
    content: body,
  });

  await axios(request)
    .then((result) => {
      return sendResponse(res, {
        body: result,
        status: 200,
      });
    })
    .catch((error) => {
      // console.error(`Downlink error: ${params.device} - ${params.authorization}: ${JSON.stringify(error.message)}`);
      return sendResponse(res, {
        body: {
          everynet_error: error.response.data,
          url,
          message: "downlink_claim error",
        },
        status: error.response.status,
      });
    });
}

export default downlinkService;
export type { IDownlinkParams };
