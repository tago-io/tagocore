import { core } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";

interface IPayloadParamsTektelic {
  payloadMetaData: {
    applicationMetaData: {
      id: { id: string; entityType: string };
      customerId?: { id: string; entityType: string };
      subCustomerId?: { id: string; entityType: string };
      name: string;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gatewayMetaDataList: any[];
    deviceMetaData: {
      id: { id: string; entityType: string };
      name: string;
      deviceClass: string;
      deviceEUI: string;
      appEUI: string;
    };
    adr: boolean;
    fport: number;
    fcount: number;
  };
  payload: string | { [key: string]: string };
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

  const data: IPayloadParamsTektelic = req.body;
  if (!data.payloadMetaData) {
    console.error("[Network Server] Request refused, body is invalid");
    return sendResponse(res, { body: "Invalid body received", status: 401 });
  }

  const deviceEUI =
    (req.headers.device as string) ||
    data.payloadMetaData.deviceMetaData?.deviceEUI;
  const device = await getDevice(deviceEUI).catch((e) => {
    return sendResponse(res, { body: e.message || e, status: 400 });
  });

  if (!device) {
    return;
  }

  core.emitToLiveInspector(device.id, {
    title: "Uplink HTTP Request",
    content: `HOST: ${req.hostname}`,
  });

  core.addDeviceData(device.id, data).catch((e) => {
    console.error(`Error inserting data ${e.message}`);
    console.error(e);
  });

  sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
}

export default uplinkService;
export { getDevice };
