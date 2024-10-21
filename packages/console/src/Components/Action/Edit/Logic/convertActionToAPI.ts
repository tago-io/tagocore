import type { IAction } from "@tago-io/tcore-sdk/types";
import normalizeTags from "../../../../Helpers/normalizeTags.ts";
import {
  type IConditionData,
  type IScheduleData,
  zFrontActionScript,
  zFrontActionTagoIO,
  zFrontActionPost,
} from "../../Action.interface";

/**
 * Receives separate data structures and joins them into a single action object.
 * This resulting action object will be ready to be sent to the API.
 */
function convertActionToAPI(
  data: IAction,
  action: any,
  scheduleData: IScheduleData,
  conditionData: IConditionData,
  pluginTriggerData: any
): IAction {
  const result: Partial<IAction> = {
    active: data.active,
    name: data.name,
    tags: normalizeTags(data.tags),
    type: data.type,
  };

  if (result.type === "interval" || result.type === "schedule") {
    // Schedule type
    result.type = scheduleData.type;

    if (result.type === "interval") {
      const interval = `${scheduleData.interval} ${scheduleData.interval_unit}`;
      result.trigger = [{ interval }];
    } else {
      const cron = scheduleData.cron;
      const timezone = scheduleData.timezone?.id | scheduleData.timezone;
      result.trigger = [{ cron, timezone }];
    }
  } else if (result.type === "condition") {
    // Condition type
    result.type = "condition";
    result.trigger = [];
    result.lock = conditionData.lock || false;

    for (const condition of conditionData.conditions || []) {
      if (conditionData.type === "single") {
        condition.device = conditionData.device?.id || conditionData.device;
        condition.tag_key = undefined;
        condition.tag_value = undefined;
      } else {
        condition.device = undefined;
        condition.tag_key = conditionData.tag?.key;
        condition.tag_value = conditionData.tag?.value;
      }
      result.trigger.push(condition);
    }

    for (const condition of conditionData.unlockConditions || []) {
      if (conditionData.type === "single") {
        condition.device = conditionData.device?.id || conditionData.device;
        condition.tag_key = undefined;
        condition.tag_value = undefined;
      } else {
        condition.device = undefined;
        condition.tag_key = conditionData.tag?.key;
        condition.tag_value = conditionData.tag?.value;
      }
      condition.unlock = true;
      result.trigger.push(condition);
    }
  } else {
    // Plugin type
    result.trigger = pluginTriggerData;
  }

  if (action?.type === "script") {
    result.action = zFrontActionScript.parse(action);
    result.action.script = result.action.script.map((x: any) => x.id || x);
  } else if (action?.type === "tagoio") {
    result.action = zFrontActionTagoIO.parse(action);
  } else if (action?.type === "post") {
    result.action = zFrontActionPost.parse(action);
  } else {
    result.action = action;
  }

  return result as IAction;
}

export { convertActionToAPI };
