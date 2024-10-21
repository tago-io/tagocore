import * as ActionService from "../Services/Action.ts";
import * as AnalysisService from "../Services/Analysis.ts";
import * as DeviceService from "../Services/Device.ts";
import * as DeviceDataService from "../Services/DeviceData/DeviceData.ts";
import {
  createFolder,
  doesFileOrFolderExist,
  getFileURI,
  getFolderURI,
  readFile,
  writeFile,
} from "../Services/File.ts";
import { getComputerUsage, getOSInfo } from "../Services/Hardware.ts";
import * as LiveInspectorService from "../Services/LiveInspector.ts";
/* eslint-disable prettier/prettier */
import { hideModuleMessage, showModuleMessage } from "../Services/Plugins.ts";
import {
  deletePluginStorageItem,
  getAllPluginStorageItems,
  getPluginStorageItem,
  setPluginStorageItem,
} from "../Services/PluginsStorage.ts";
import { getSummary } from "../Services/Summary.ts";
import { getTagKeys } from "../Services/Tag.ts";
import { plugins } from "./Host.ts";

/**
 * This function is a helper to execute plugin requests, such as creating
 * devices, listing resources, and stuff like that.
 */
async function executePluginRequest(
  pluginID: string,
  method: string,
  ...e: any[]
) {
  switch (method) {
    // pluginStorage
    case "getPluginStorageItem":
      return getPluginStorageItem(pluginID, e[0]);
    case "setPluginStorageItem":
      return setPluginStorageItem(pluginID, e[0], e[1]);
    case "deletePluginStorageItem":
      return deletePluginStorageItem(pluginID, e[0]);
    case "getAllPluginStorageItems":
      return getAllPluginStorageItems(pluginID);

    // file
    case "writeFile":
      return writeFile(pluginID, e[0], e[1], e[2]);
    case "createFolder":
      return createFolder(pluginID, e[0]);
    case "deleteFileOrFolder":
      return createFolder(pluginID, e[0]);
    case "readFile":
      return readFile(pluginID, e[0], e[1]);
    case "doesFileOrFolderExist":
      return doesFileOrFolderExist(pluginID, e[0]);
    case "getFileURI":
      return getFileURI(pluginID, e[0]);
    case "getFolderURI":
      return getFolderURI(pluginID);

    // device
    case "deleteDeviceParam":
      return call(pluginID, "device", DeviceService, "deleteDeviceParam", ...e);
    case "setDeviceParams":
      return call(pluginID, "device", DeviceService, "setDeviceParams", ...e);
    case "getDeviceParamList":
      return call(
        pluginID,
        "device",
        DeviceService,
        "getDeviceParamList",
        ...e,
      );
    case "deleteDeviceToken":
      return call(pluginID, "device", DeviceService, "deleteDeviceToken", ...e);
    case "createDeviceToken":
      return call(pluginID, "device", DeviceService, "createDeviceToken", ...e);
    case "getDeviceTokenList":
      return call(
        pluginID,
        "device",
        DeviceService,
        "getDeviceTokenList",
        ...e,
      );
    case "getDeviceByToken":
      return call(pluginID, "device", DeviceService, "getDeviceByToken", ...e);
    case "getDeviceList":
      return call(pluginID, "device", DeviceService, "getDeviceList", ...e);
    case "getDeviceInfo":
      return call(pluginID, "device", DeviceService, "getDeviceInfo", ...e);
    case "editDevice":
      return call(pluginID, "device", DeviceService, "editDevice", ...e);
    case "deleteDevice":
      return call(pluginID, "device", DeviceService, "deleteDevice", ...e);
    case "createDevice":
      return call(pluginID, "device", DeviceService, "createDevice", ...e);
    case "emitToLiveInspector":
      return call(
        pluginID,
        "device",
        LiveInspectorService,
        "emitToLiveInspectorViaPlugin",
        pluginID,
        ...e,
      );

    // deviceData
    case "getDeviceDataAmount":
      return call(
        pluginID,
        "device-data",
        DeviceDataService,
        "getDeviceDataAmount",
        ...e,
      );
    case "addDeviceData":
      return call(
        pluginID,
        "device-data",
        DeviceDataService,
        "addDeviceData",
        ...e,
      );
    case "getDeviceData":
      return call(
        pluginID,
        "device-data",
        DeviceDataService,
        "getDeviceData",
        ...e,
      );
    case "deleteDeviceData":
      return call(
        pluginID,
        "device-data",
        DeviceDataService,
        "deleteDeviceData",
        ...e,
      );

    // analysis
    case "getAnalysisList":
      return call(
        pluginID,
        "analysis",
        AnalysisService,
        "getAnalysisList",
        ...e,
      );
    case "getAnalysisInfo":
      return call(
        pluginID,
        "analysis",
        AnalysisService,
        "getAnalysisInfo",
        ...e,
      );
    case "editAnalysis":
      return call(pluginID, "analysis", AnalysisService, "editAnalysis", ...e);
    case "deleteAnalysis":
      return call(
        pluginID,
        "analysis",
        AnalysisService,
        "deleteAnalysis",
        ...e,
      );
    case "createAnalysis":
      return call(
        pluginID,
        "analysis",
        AnalysisService,
        "createAnalysis",
        ...e,
      );

    // action
    case "getActionTypes":
      return call(pluginID, "action", ActionService, "getActionTypes", ...e);
    case "getActionList":
      return call(pluginID, "action", ActionService, "getActionList", ...e);
    case "getActionInfo":
      return call(pluginID, "action", ActionService, "getActionInfo", ...e);
    case "triggerAction":
      return call(pluginID, "action", ActionService, "triggerAction", ...e);
    case "editAction":
      return call(pluginID, "action", ActionService, "editAction", ...e);
    case "deleteAction":
      return call(pluginID, "action", ActionService, "deleteAction", ...e);
    case "createAction":
      return call(pluginID, "action", ActionService, "createAction", ...e);

    // tag
    case "getTagKeys":
      return getTagKeys(e[0]);

    // summary
    case "getSummary":
      return getSummary();

    // hardware
    case "getOSInfo":
      return getOSInfo();
    case "getComputerUsage":
      return getComputerUsage();

    // others
    case "showMessage":
      return showModuleMessage(pluginID, e[0], e[1]);
    case "hideMessage":
      return hideModuleMessage(pluginID, e[0]);
  }

  throw new Error("API Service not implemented");
}

/**
 */
async function call(
  pluginID: string,
  perm: string,
  service: any,
  name: string,
  ...e: any[]
) {
  const plugin = plugins.get(pluginID);
  if (!plugin?.permissions?.includes?.(perm)) {
    // not enough permission to call this function
    const message = `Failed to call "${name}", needs "${perm}" permission`;
    throw message;
  }

  return await service[name](...e);
}

export default executePluginRequest;
