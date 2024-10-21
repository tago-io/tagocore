import { core, helpers } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";

interface IPayloadParamsTTI {
  //TTI
  end_device_ids: {
    dev_eui: string;
    device_id: string;
    application_ids: {
      application_id: string;
    };
  };
  uplink_message: {
    f_cnt: number;
    f_port: number;
    frm_payload: string;
  };
  downlink_url?: string;
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
 * @returns {void}
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
    return sendResponse(res, {
      body: "Invalid authorization header",
      status: 401,
    });
  }

  const data: IPayloadParamsTTI = req.body;
  if (!data.end_device_ids) {
    console.error("[Network Server] Request refused, body is invalid");
    return sendResponse(res, { body: "Invalid body received", status: 401 });
  }

  const { dev_eui: devEUI } = data.end_device_ids;
  const device = await getDevice(devEUI).catch((e) => {
    return sendResponse(res, { body: e.message || e, status: 400 });
  });

  if (!device) {
    return;
  }

  core.emitToLiveInspector(device.id, {
    title: "Uplink HTTP Request",
    content: `HOST: ${req.hostname}`,
  });

  const downlinkKey = (req.headers["X-Downlink-Apikey"] ||
    req.headers["x-downlink-apikey"]) as string | undefined;
  const downlinkUrl = (req.headers["X-Downlink-Push"] ||
    req.headers["x-downlink-push"]) as string | undefined;
  if (downlinkKey || downlinkUrl) {
    const deviceParams = await core.getDeviceParamList(device.id);

    const defaultParamSettings = (key: string) => {
      deviceParams.push({ key, value: "", id: helpers.generateResourceID() });
      return deviceParams[deviceParams.length - 1];
    };

    const urlParam =
      deviceParams.find((param) => param.key === "downlink_url") ||
      defaultParamSettings("downlink_url");
    const keyParam =
      deviceParams.find((param) => param.key === "downlink_key") ||
      defaultParamSettings("downlink_key");

    if (downlinkUrl) {
      urlParam.value = String(downlinkUrl);
    }

    if (downlinkKey) {
      keyParam.value = String(downlinkKey);
    }

    core.setDeviceParams(device.id, deviceParams);
  }

  core.addDeviceData(device.id, data).catch((e) => {
    console.error(`Error inserting data ${e.message}`);
    console.error(e);
  });

  sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
}

export default uplinkService;
export { getDevice };
