import { core } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";
import { getDevice } from "./uplink.ts";

interface IClassAConfig {
  downlink_key: string;
  url: string;
}

interface IMeta {
  device?: string;
  network?: string;
  application?: string;
  device_addr?: string;
  gateway?: string;
  packet_id?: number;
  packet_hash?: string;
}

interface IEverynetParams {
  authorization?: string;
  device?: string;
  meta?: IMeta;
  verification_code?: string;
  // something else goes together on tagoio request to everynet, doesn't show what
}

/**
 * Send the downlink when Everynet request it
 *
 * @param config - Plugin configuration
 * @param req - request
 * @param res - request response
 * @returns {void}
 */
async function everynetDownlinkRequest(
  config: IConfigParam,
  req: Request,
  res: Response,
) {
  const body = <IEverynetParams>req.body;

  const authorization =
    req.headers.Authorization ||
    req.headers.authorization ||
    body?.meta?.application;
  if (!authorization || authorization !== config.authorization_code) {
    console.error(
      `[Network Server] Request refused, authentication is invalid: ${authorization}`,
    );
    return sendResponse(res, {
      body: "Invalid authorization header",
      status: 401,
    });
  }

  const serieNumber = body.device || body.meta?.device;
  if (!serieNumber) {
    return sendResponse(res, {
      body: { message: `Device not found ${serieNumber}` },
      status: 204,
    });
  }

  const device = await getDevice(serieNumber);
  const params = await core.getDeviceParamList(device.id);

  const downlinkParam = params.find((x) => x.key === "downlink" && !x.sent);
  const fportParam = params.find((x) => x.key === "port");
  const confirmedParam = params.find((x) => x.key === "confirmed");

  if (!downlinkParam?.value || !fportParam?.value) {
    return sendResponse(res, { body: {}, status: 204 });
  }

  const convertConfirmed = (value?: string | boolean) =>
    value && (value === "true" || typeof value === "boolean");
  const response = {
    meta: {
      network: body.meta?.network,
      application: body.meta?.application,
      device_addr: body.meta?.device_addr,
      device: serieNumber,
      gateway: body.meta?.gateway,
      packet_id: new Date().getTime(),
      packet_hash: body.meta?.packet_hash,
    },
    type: "downlink_response",
    params: {
      confirmed: !!convertConfirmed(confirmedParam?.value),
      payload: String(downlinkParam?.value),
      port: fportParam ? Number(fportParam?.value) : 1,
    },
  };

  downlinkParam.sent = true;
  await core.setDeviceParams(device.id, params);

  console.info(
    `Downlink Request delivered with success: ${serieNumber} - ${authorization}`,
  );
  return sendResponse(res, { body: response, status: 200 });
}

export default everynetDownlinkRequest;
export type { IClassAConfig };
