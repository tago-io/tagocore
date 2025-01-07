import { core, helpers } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";

interface IHeliumPayload {
  app_eui: string;
  dc: object;
  dev_eui: string;
  devaddr: string;
  downlink_string?: string;
  downlink_url?: string;
  fcnt: number;
  hotspots: object[];
  id: string;
  metadata: object;
  name: string;
  payload: string;
  payload_size: number;
  port: number;
  reported_at: number;
}

/**
 * Check if the device exists in the application by the serial tag.
 *
 * @param devEui - device eui
 * @returns {IDevice} device information
 */
async function getDevice(devEui: string) {
  const deviceList = await core.getDeviceList({
    amount: 10000,
    page: 1,
    fields: ["id", "name", "tags"],
  });

  if (!deviceList || !deviceList.length) {
    throw "Authorization Denied: Device EUI doesn't match any serial tag";
  }
  const device = deviceList.find((x) =>
    x.tags.find((tag) => tag.key === "serial" && tag.value === devEui),
  );
  if (!device) {
    throw "Authorization Denied: Device EUI doesn't match any serial tag";
  }

  return device;
}

/**
 * Authorize and accept uplink request
 *
 * @param config - Plugin configuration
 * @param req - express req param
 * @param res - express res param
 * @returns {void} no reponse
 */
async function uplinkService(
  config: IConfigParam,
  req: Request,
  res: Response,
) {
  const authorization = req.headers.Authorization || req.headers.authorization;
  if (!authorization || authorization !== config.authorization_code) {
    console.error(
      `[Network Server] Request refused, authentication is invalid: ${authorization}`,
    );
    sendResponse(res, { body: "Invalid authorization header", status: 401 });
    return;
  }

  const data: IHeliumPayload = req.body;
  const { dev_eui: DevEui } = data;
  const device = await getDevice(DevEui).catch((e) => {
    sendResponse(res, { body: e.message || e, status: 400 });
    return;
  });

  if (!device) {
    return;
  }

  core.emitToLiveInspector(device.id, {
    title: "Uplink HTTP Request",
    content: `HOST: ${req.hostname}`,
  });

  if (data.downlink_string || data.downlink_url) {
    const deviceParams = await core.getDeviceParamList(device.id);
    const downlinkString = deviceParams.find(
      (param) => param.key === "downlink_string",
    );

    if (!downlinkString) {
      deviceParams.push({
        key: "downlink_string",
        value:
          (data.downlink_string as string) || (data.downlink_url as string),
        sent: false,
        id: helpers.generateResourceID(),
      });

      core.setDeviceParams(device.id, deviceParams);
    } else if (downlinkString.value !== data.downlink_string || downlinkString.value !== data.downlink_url) {
      downlinkString.value = (data.downlink_string as string) || (data.downlink_url as string);
      core.setDeviceParams(device.id, deviceParams);
    }
  }

  core.addDeviceData(device.id, data).catch((e) => {
    console.error(`Error inserting data ${e.message}`);
    console.error(e);
  });

  sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
}

export default uplinkService;
export { getDevice, type IHeliumPayload };
