import { core, helpers } from "@tago-io/tcore-sdk";
import type { Request, Response } from "express";
import loraPacket from "lora-packet";
import sendResponse from "../lib/sendResponse.ts";
import type { IConfigParam } from "../types.ts";

interface IPayloadParamsActility {
  DevEUI_uplink: {
    AppSKey?: string;
    DevEUI: string;
    payload_hex: string;
    DevAddr: string;
    FCntUp: number;
    FPort: number;
    FCntDn: number;
    AS_ID: string;
    InstantPER: string;
    MeanPER: string;
    CustomerData: string;
    CustomerID: string;
    Lrrs: number;
    DynamicClass: string;
  };
}

/**
 * send downlink to the network server
 *
 * @param dowlinkBuild - object with downlink params
 * @param dowlinkBuild.FPort - port for the downlink
 * @param dowlinkBuild.payload_hex - payload in base64
 * @param dowlinkBuild.DevAddr - DevAddr for the downlink
 * @param dowlinkBuild.FCntUp - FCntUp for the downlink
 * @param dowlinkBuild.AppSKey - FCntUp for the downlink
 * @returns {string} decoded payload
 */
// eslint-disable-next-line camelcase
function decodePayload({
  payload_hex,
  DevAddr,
  FCntUp,
  FPort,
  AppSKey,
}: IPayloadParamsActility["DevEUI_uplink"]) {
  const packetFields = {
    DevAddr: Buffer.from(DevAddr, "hex"),
    FCnt: FCntUp,
    FPort,
    payload: Buffer.from(payload_hex, "hex"),
  };

  const appSKey = Buffer.from(AppSKey as string, "hex");
  const packet = loraPacket.fromFields(packetFields);

  return loraPacket.decrypt(packet, appSKey).toString("hex");
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

  const data: IPayloadParamsActility = req.body;
  if (!data.DevEUI_uplink) {
    console.error("[Network Server] Request refused, body is invalid");
    return sendResponse(res, { body: "Invalid body received", status: 401 });
  }

  const { DevEUI: devEui } = data.DevEUI_uplink;
  const device = await getDevice(devEui).catch((e) => {
    return sendResponse(res, { body: e.message || e, status: 400 });
  });

  if (!device) {
    return sendResponse(res, {
      body: { message: `Device not found: ${devEui}` },
      status: 400,
    });
  }

  core.emitToLiveInspector(device.id, {
    title: "Uplink HTTP Request",
    content: `HOST: ${req.hostname}`,
  });

  if (data.DevEUI_uplink.AppSKey) {
    data.DevEUI_uplink.payload_hex = decodePayload(data.DevEUI_uplink);
  }

  if (data.DevEUI_uplink.AS_ID || data.DevEUI_uplink.FCntDn) {
    let deviceParams = await core.getDeviceParamList(device.id);

    const defaultParamSettings = (key: string) => {
      const index = deviceParams.push({
        key,
        value: "",
        id: helpers.generateResourceID(),
        sent: false,
      });
      return deviceParams[index - 1];
    };

    const asIDParam =
      deviceParams.find((param) => param.key === "as_id") ||
      defaultParamSettings("as_id");
    const fctdnParam =
      deviceParams.find((param) => param.key === "fctdn") ||
      defaultParamSettings("fctdn");

    if (data.DevEUI_uplink.AS_ID) {
      asIDParam.value = String(data.DevEUI_uplink.AS_ID);
    }

    if (data.DevEUI_uplink.FCntDn) {
      fctdnParam.value = String(data.DevEUI_uplink.FCntDn);
    }
    deviceParams = deviceParams.map((param) => ({
      ...param,
      sent: !!param.sent,
    }));
    core.setDeviceParams(device.id, deviceParams);
  }

  await core
    .addDeviceData(device.id, data.DevEUI_uplink)
    .then(() => {
      sendResponse(res, { body: { message: "Data accepted" }, status: 201 });
    })
    .catch((e) => {
      console.error(`Error inserting data ${e.message}`);
      sendResponse(res, { body: { message: e.message }, status: 400 });
    });
}

export default uplinkService;
export { getDevice, type IPayloadParamsActility };
