import {
  type ICreateDeviceResponse,
  type IDevice,
  type IDeviceCreate,
  type IDeviceEdit,
  type IDeviceList,
  type IDeviceListQuery,
  type IDeviceParameterCreate,
  type IDeviceToken,
  type IDeviceTokenCreate,
  type IDeviceTokenCreateResponse,
  type IDeviceTokenListQuery,
  type TGenericID,
  type TGenericToken,
  zDevice,
  zDeviceCreate,
  zDeviceEdit,
  zDeviceList,
  zDeviceListQuery,
  zDeviceParameter,
  zDeviceParameterCreate,
  zDeviceToken,
  zDeviceTokenCreate,
} from "@tago-io/tcore-sdk/types";
import { z } from "zod";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";

/**
 * Validates a device ID, throws an error if it doesn't exist.
 */
export const validateDeviceID = async (deviceID: TGenericID): Promise<void> => {
  const device = await getDeviceInfo(deviceID);
  if (!device) {
    throw new Error("Invalid Device ID");
  }
};

/**
 * Retrieves a device token.
 */
export async function getDeviceToken(
  token: string,
): Promise<IDeviceToken | null> {
  if (!token) {
    throw new Error("Invalid Device Token");
  }
  const tokenData = await invokeDatabaseFunction("getDeviceToken", token);
  if (tokenData) {
    const parsed = await zDeviceToken.parseAsync(tokenData);
    return parsed;
  }
  return null;
}

/**
 * Deletes a device's param.
 */
export async function deleteDeviceParam(id: TGenericID): Promise<void> {
  await invokeDatabaseFunction("deleteDeviceParam", id);
}

/**
 * Overrides or edits device parameters.
 */
export async function setDeviceParams(
  deviceID: TGenericID,
  parameters: IDeviceParameterCreate[],
): Promise<void> {
  await validateDeviceID(deviceID);
  const parsed = await z.array(zDeviceParameterCreate).parseAsync(parameters);
  await invokeDatabaseFunction("setDeviceParams", deviceID, parsed);
}

/**
 * Gets all the parameters of a device.
 */
export async function getDeviceParamList(
  deviceID: TGenericID,
  sentStatus?: boolean,
) {
  await validateDeviceID(deviceID);
  const response = await invokeDatabaseFunction(
    "getDeviceParamList",
    deviceID,
    sentStatus,
  );
  const parsed = await z.array(zDeviceParameter).parseAsync(response);
  return parsed;
}

/**
 * Deletes a device's token.
 */
export async function deleteDeviceToken(token: TGenericToken): Promise<void> {
  await invokeDatabaseFunction("deleteDeviceToken", token);
}

/**
 * Generates and retrieves a new device token.
 */
export async function createDeviceToken(
  deviceID: TGenericID,
  data: IDeviceTokenCreate,
): Promise<IDeviceTokenCreateResponse> {
  await validateDeviceID(deviceID);

  const parsed = await zDeviceTokenCreate.parseAsync(data);
  await invokeDatabaseFunction("createDeviceToken", deviceID, parsed);

  return {
    expire_time: parsed.expire_time,
    permission: parsed.permission,
    token: parsed.token,
  };
}

/**
 * Lists all the tokens of a device.
 */
export async function getDeviceTokenList(
  deviceID: TGenericID,
  query: IDeviceTokenListQuery,
): Promise<IDeviceToken[]> {
  await validateDeviceID(deviceID);
  const response = await invokeDatabaseFunction(
    "getDeviceTokenList",
    deviceID,
    query,
  );
  return response;
}

/**
 * Retrieves all the information of a single device via token.
 */
export async function getDeviceByToken(token: TGenericToken): Promise<IDevice> {
  if (!token) {
    throw new Error("Invalid token");
  }

  const device = await invokeDatabaseFunction("getDeviceByToken", token);
  if (!device) {
    throw new Error("Invalid token");
  }

  const response = await zDevice.parseAsync(device);
  return response;
}

/**
 * Lists all the devices.
 */
export async function getDeviceList(
  query: IDeviceListQuery,
): Promise<IDeviceList> {
  const queryParsed = await zDeviceListQuery.parseAsync(query);
  const response = await invokeDatabaseFunction("getDeviceList", queryParsed);
  const parsed = await zDeviceList.parseAsync(response);
  return parsed;
}

/**
 * Retrieves all the information of a single device.
 */
export const getDeviceInfo = async (id: TGenericID): Promise<IDevice> => {
  if (!id) {
    throw new Error("Invalid Device ID");
  }
  const device = await invokeDatabaseFunction("getDeviceInfo", id);
  if (!device) {
    throw new Error("Invalid Device ID");
  }
  const parsed = await zDevice.parseAsync(device);
  if (parsed.chunk_period && parsed.chunk_retention) {
    parsed.data_retention = `${parsed.chunk_retention} ${parsed.chunk_period}`;
  }
  return parsed;
};

/**
 * Edits a single device.
 */
export const editDevice = async (
  id: TGenericID,
  device: IDeviceEdit,
): Promise<void> => {
  await validateDeviceID(id);
  const parsed = await zDeviceEdit.parseAsync(device);
  await invokeDatabaseFunction("editDevice", id, parsed);
};

/**
 * Deletes a single device.
 */
export async function deleteDevice(id: TGenericID): Promise<void> {
  await validateDeviceID(id);
  await invokeDatabaseFunction("deleteDevice", id);
}

/**
 * Creates a new device.
 */
export async function createDevice(
  data: IDeviceCreate,
): Promise<ICreateDeviceResponse> {
  const parsed = await zDeviceCreate.parseAsync(data);

  await invokeDatabaseFunction("createDevice", parsed);

  const token = await createDeviceToken(parsed.id, {
    name: "Default",
    expire_time: "never",
  });

  return {
    device_id: parsed.id,
    token: token.token,
  };
}
