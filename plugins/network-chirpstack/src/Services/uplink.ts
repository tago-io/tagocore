import { core } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";

interface IChirpstackPayload {
  applicationID: string;
  applicationName: string;
  deviceName: string;
  devEUI: string;
  deviceInfo: any;
  devAddr: string;
  rxInfo: any[];
  txInfo: any;
  adr: boolean;
  dr: number;
  fCnt: number;
  fPort: number;
  data?: string;
  payload?: string;
  objectJSON: string;
  tags: any;
  margin: number;
  externalPowerSource: boolean;
  batteryLevelUnavailable: boolean;
  batteryLevel: number;
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

  const data: IChirpstackPayload = req.body;
  const deviceEUI = data.devEUI || data.deviceInfo.devEui;
  if (!deviceEUI) {
    console.error("[Network Server] Request refused, body is invalid");
    return sendResponse(res, { body: "Invalid body received", status: 401 });
  }

  const hSerial = deviceEUI;
  let hardwareSerial = Buffer.from(hSerial, "base64").toString("hex");
  if (hardwareSerial.length !== 16) {
    hardwareSerial = hSerial;
  }

  const device = await getDevice(hardwareSerial).catch((e) => {
    return sendResponse(res, { body: e.message || e, status: 400 });
  });

  if (!device) {
    return;
  }

  core.emitToLiveInspector(device.id, {
    title: "Uplink HTTP Request",
    content: `HOST: ${req.hostname}`,
  });

  await core.addDeviceData(device.id, data).catch((e) => {
    console.error(`Error inserting data ${e.message}`);
    console.error(e);
    sendResponse(res, { body: { message: e.message }, status: 201 });
  });

  sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
}

export default uplinkService;
export { getDevice };
export type { IChirpstackPayload };
