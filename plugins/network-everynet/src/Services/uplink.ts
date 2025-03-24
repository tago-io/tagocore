import { core } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import type { IEverynetObject } from "./IEverynetObject.ts";

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
  try {
    const data: IEverynetObject = req.body;
    const devEui = data.params.device || data.meta?.device;
    if (!devEui) return sendResponse(res, { body: { message: "Missing serial number" }, status: 400 });

    const authorization =
      req.headers.Authorization ||
      req.headers.authorization ||
      data.meta?.application;
    if (!authorization || authorization !== config.authorization_code) {
      console.error(
        `[Network Server] Request refused, authentication is invalid: ${authorization}`,
      );
      return sendResponse(res, {
        body: "Invalid authorization header",
        status: 401,
      });
    }

    const device = await getDevice(devEui).catch((e) => {
      return sendResponse(res, { body: e.message || e, status: 400 });
    });

    if (!device) {
      return sendResponse(res, {
        body: `Device EUI not found ${devEui}`,
        status: 401,
      });
    }

    core.addDeviceData(device.id, data).catch((e) => {
      console.error(`Error inserting data ${e.message}`);
      console.error(e);
      sendResponse(res, { body: { message: e.message }, status: 201 });
    });

    sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
  } catch (error) {
    console.error(error);
    sendResponse(res, { body: error.message || error, status: 500 });
  }
}

export default uplinkService;
export { getDevice };
