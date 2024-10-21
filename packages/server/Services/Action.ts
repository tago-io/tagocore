import { createRequire } from "node:module";
import {
  type IAction,
  type IActionCreate,
  type IActionEdit,
  type IActionList,
  type IActionListQuery,
  type IActionOption,
  type IActionTriggerModuleSetup,
  type IActionTypeModuleSetup,
  type IDevice,
  type IDeviceData,
  type TGenericID,
  zAction,
  zActionCreate,
  zActionEdit,
  zActionList,
  zActionListQuery,
} from "@tago-io/tcore-sdk/types";
import axios from "axios";
import splitColon from "../Helpers/splitColon.ts";
import { plugins } from "../Plugins/Host.ts";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import { runAnalysis } from "./AnalysisCodeExecution.ts";
import { getDeviceByToken } from "./Device.ts";
import { addDeviceData } from "./DeviceData/DeviceData.ts";
import { getModuleList } from "./Plugins.ts";
const require = createRequire(import.meta.url);
const { Device } = require("@tago-io/sdk");

/**
 * Fixes a value's type before evaluating it.
 */
function fixConditionTriggerValue(type: string, rawValue: any) {
  let value: any;
  if (type === "number") value = Number(rawValue) || 0;
  else if (type === "boolean")
    value = rawValue && rawValue !== "false" && rawValue !== "0";
  else value = String(rawValue);
  return value;
}

/**
 * Validates an action ID, throws an error if it doesn't exist.
 */
export async function validateActionID(id: TGenericID): Promise<void> {
  const action = await invokeDatabaseFunction("getActionInfo", id);
  if (!action) {
    throw new Error("Invalid Action ID");
  }
}

/**
 * Lists all the action triggers.
 */
export function getActionTriggers(): any[] {
  const options: any[] = [];
  const modules = getModuleList("action-trigger");

  for (const module of modules) {
    const option = (module.setup as unknown as IActionTriggerModuleSetup)
      .option;

    const type: any = {
      configs: option.configs || [],
      description: option.description,
      id: `${module.plugin.id}:${module.setup.id}`,
      name: option.name,
    };

    options.push(type);
  }

  return options;
}

/**
 * Lists all the action types.
 */
export function getActionTypes(): IActionOption[] {
  const options: IActionOption[] = [];
  const modules = getModuleList("action-type");

  for (const module of modules) {
    const option = (module.setup as unknown as IActionTypeModuleSetup).option;
    options.push({
      ...option,
      id: `${module.plugin.id}:${module.setup.id}`,
    } as any);
  }

  return options;
}

/**
 * Lists all the actions.
 */
export const getActionList = async (
  query: IActionListQuery,
): Promise<IActionList> => {
  const queryParsed = await zActionListQuery.parseAsync(query);
  const response = await invokeDatabaseFunction("getActionList", queryParsed);
  const parsed = await zActionList.parseAsync(response);
  return parsed;
};

/**
 * Retrieves all the information of a single action.
 */
export async function getActionInfo(id: TGenericID): Promise<IAction> {
  const action = await invokeDatabaseFunction("getActionInfo", id);
  if (!action) {
    throw new Error("Invalid Action ID");
  }
  const parsed = await zAction.parseAsync(action);
  return parsed;
}

/**
 */
export function getConditionTriggerMatchingData(
  triggers: any[],
  device: IDevice,
  data: IDeviceData,
): boolean {
  for (const trigger of triggers) {
    const itemValue = data.value as any;

    const triggerValue = fixConditionTriggerValue(
      trigger.value_type,
      trigger.value,
    );
    const triggerSecondValue = fixConditionTriggerValue(
      trigger.value_type,
      trigger.second_value,
    );

    const hasTagsMatch = device.tags.some(
      (x) => x.key === trigger.tag_key && x.value === trigger.tag_value,
    );

    if (
      (device.id === trigger.device || hasTagsMatch) &&
      data.variable === trigger.variable
    ) {
      if (trigger.is === "=" && itemValue === triggerValue) return true;
      if (trigger.is === "!" && itemValue !== triggerValue) return true;
      if (trigger.is === "<" && itemValue < triggerValue) return true;
      if (trigger.is === ">" && itemValue > triggerValue) return true;
      if (
        trigger.is === "><" &&
        itemValue > triggerValue &&
        itemValue < triggerSecondValue
      )
        return true;
      if (trigger.is === "*") return true;
    }
  }

  return false;
}

/**
 * Triggers an action.
 */
export async function triggerAction(id: TGenericID, data?: any): Promise<void> {
  const action = await getActionInfo(id);
  const actionObject = action.action;

  const usesPluginTrigger = actionObject.type?.includes(":");
  if (usesPluginTrigger) {
    // custom type for the action
    await triggerActionPluginType(action, data);
  } else if (actionObject.type === "script") {
    // analysis type
    await triggerActionScriptType(action, data);
  } else if (actionObject.type === "post") {
    // post HTTP type
    await triggerActionPostType(action, data);
  } else if (actionObject.type === "tagoio") {
    // post to TagoIO
    await triggerActionTagoIOType(action, data);
  }

  await editAction(id, { last_triggered: new Date() });
}

/**
 * Triggers an action that redirects data to TagoIO.
 */
async function triggerActionTagoIOType(
  action: IAction,
  data: any,
): Promise<void> {
  const token = action?.action?.token;
  if (!token) {
    return;
  }

  const device = new Device({ token, region: "usa-1" });
  await device.sendData(data);
}

/**
 * Triggers an action that does a POST HTTP.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the analyses.
 */
async function triggerActionPostType(
  action: IAction,
  data: any,
): Promise<void> {
  if (!action?.action?.url) {
    return;
  }

  const headersObj = action.action.headers || {};

  for (let i = 0; i < 10; i++) {
    try {
      headersObj["TagoIO-Retries"] = i + 1;
      await axios({
        method: "POST",
        data,
        url: action.action.url,
        headers: headersObj,
      });
      return;
    } catch (ex) {
      // error
    }
  }

  if (
    action.action.http_post_fallback_enabled &&
    action.action.fallback_token
  ) {
    const device = await getDeviceByToken(action.action.fallback_token);
    await addDeviceData(device.id, data);
  }
}

/**
 * Triggers an action that runs scripts.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the script.
 */
async function triggerActionScriptType(
  action: IAction,
  data: any,
): Promise<void> {
  const script = action?.action?.script || [];
  for (const analysis of script) {
    runAnalysis(analysis, data).catch(() => null);
  }
}

/**
 * Triggers an action with a custom plugin type.
 * @param {IAction} action The action to be triggered.
 * @param {any} data The data to be passed as parameter to the onCall of the action.
 */
async function triggerActionPluginType(
  action: IAction,
  data: any,
): Promise<void> {
  const actionObject = action.action;
  if (!actionObject.type?.includes(":")) {
    return;
  }

  const [pluginID, moduleID] = splitColon(action?.action.type);
  const plugin = plugins.get(pluginID);
  const module = plugin?.modules.get(moduleID);
  actionObject.type = undefined;

  await module?.invokeOnCall(action.id, actionObject, data).catch(() => false);
}

/**
 * Invokes the `onTriggerChange` in the `action-trigger` plugins.
 */
export async function invokeActionOnTriggerChange(
  id: TGenericID,
  actionType: string,
  actionTrigger: any,
) {
  const modules = getModuleList("action-trigger");

  for (const module of modules) {
    const usesPluginTrigger = actionType?.includes(":");
    if (usesPluginTrigger) {
      const [pluginID, moduleID] = splitColon(actionType);
      if (module.setup.id === moduleID && module.plugin.id === pluginID) {
        module.invokeOnTriggerChange(id, actionTrigger).catch(() => null);
      }
    }
  }
}

/**
 * Edits a single action.
 */
export async function editAction(
  id: TGenericID,
  action: IActionEdit,
): Promise<void> {
  const oldAction = await getActionInfo(id);

  const parsed = await zActionEdit.parseAsync(action);
  await invokeDatabaseFunction("editAction", id, parsed);

  const triggerChanged =
    JSON.stringify(oldAction.trigger) !== JSON.stringify(parsed.trigger);
  if (parsed.trigger && triggerChanged) {
    await invokeActionOnTriggerChange(id, oldAction.type, action.trigger);
  }
}

/**
 * Deletes a single action.
 */
export async function deleteAction(id: TGenericID): Promise<void> {
  await validateActionID(id);
  await invokeDatabaseFunction("deleteAction", id);
}

/**
 * Creates a new action.
 */
export async function createAction(action: IActionCreate): Promise<TGenericID> {
  const parsed = await zActionCreate.parseAsync(action);
  await invokeDatabaseFunction("createAction", parsed);
  return parsed.id;
}
