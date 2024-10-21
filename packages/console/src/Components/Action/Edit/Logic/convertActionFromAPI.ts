import type { IAction } from "@tago-io/tcore-sdk/types";
import cloneDeep from "lodash.clonedeep";
import { DateTime } from "luxon";
import type { IConditionData, IScheduleData, TScheduleDataIntervalUnit } from "../../Action.interface";
import { spreadCronToScheduleData } from "./spreadCronToScheduleData.ts";

interface IResult {
  scheduleData: IScheduleData;
  conditionData: IConditionData;
  pluginTriggerData: any;
  action: any;
}

function convertActionFromAPI(action: IAction): IResult {
  const scheduleData: IScheduleData = {};
  const conditionData: IConditionData = {};
  let actionObject: any = {};
  let pluginTriggerData: any = {};

  if (action.type === "interval" || action.type === "schedule") {
    const triggers = Array.isArray(action.trigger) ? action.trigger : [];
    const amount = triggers.length;
    if (amount > 1) {
      // can't render if there are multiple triggers, front-end supports only 1
      scheduleData.canRender = false;
    } else {
      scheduleData.canRender = true;
      scheduleData.interval = "";
      scheduleData.interval_unit = "minute";
      scheduleData.repeat_weekdays = { [DateTime.now().weekdayLong]: true };
      scheduleData.repeat_unit = 1;
      scheduleData.repeat_type = "day";
      scheduleData.repeat_hour = DateTime.now().toFormat("HH:mm");
      scheduleData.repeat_date = DateTime.now().toFormat("dd");
      scheduleData.timezone = DateTime.now().zoneName;
      scheduleData.type = action.type;

      if (action.type === "interval") {
        const interval = action.trigger?.[0]?.interval;
        if (interval) {
          // this will transform the data_retention to something we can understand
          // '12 Weeks' will become '12 week'
          const split = String(interval).trim().toLowerCase().replace("s", "").split(" ");
          const value = split[0];
          const unit = split[1];
          scheduleData.interval = Number(value);
          scheduleData.interval_unit = unit as TScheduleDataIntervalUnit;
        }
      } else if (action.type === "schedule") {
        const firstTrigger = action?.trigger?.[0];
        if (firstTrigger) {
          scheduleData.timezone = firstTrigger.timezone || DateTime.now().zoneName;
          scheduleData.cron = firstTrigger.cron || "";
          spreadCronToScheduleData(firstTrigger.cron, scheduleData);
        }
      }

      scheduleData.recurrenceType = scheduleData.canRender ? "basic" : "advanced";
    }
  } else if (action.type === "condition") {
    const first = action.trigger?.[0];
    const trigger = cloneDeep(Array.isArray(action.trigger) ? action.trigger : []);
    conditionData.conditions = [];
    conditionData.unlockConditions = [];
    conditionData.lock = action.lock || false;

    for (const item of trigger) {
      if (item.unlock) {
        conditionData.unlockConditions.push(item);
      } else {
        conditionData.conditions.push(item);
      }
    }

    if (first && "tag_key" in first) {
      conditionData.type = "multiple";
      conditionData.type = first?.tag_key ? "multiple" : "single";
      conditionData.tag = { key: first?.tag_key || "", value: first?.tag_value || "" };
    } else {
      conditionData.type = "single";
      conditionData.device = first?.device;
    }
  } else {
    pluginTriggerData = cloneDeep(action.trigger || {});
  }

  actionObject = cloneDeep(action.action);

  if (action.action?.type === "post") {
    actionObject.headers = [];
    for (const key in action.action.headers || {}) {
      if (action.action.headers[key]) {
        actionObject.headers.push({ name: key, value: action.action.headers[key] });
      }
    }
  }

  return {
    pluginTriggerData,
    scheduleData,
    conditionData,
    action: actionObject,
  };
}

export { convertActionFromAPI };
