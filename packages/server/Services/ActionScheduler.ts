import cronParser from "cron-parser";
import { DateTime } from "luxon";
import { parseRelativeDate } from "../Helpers/Time.ts";
import { getActionList, triggerAction } from "./Action.ts";

let interval: ReturnType<typeof setInterval>;

interface IIntervalTrigger {
  id: string;
  interval: string;
  last_triggered?: Date | null;
  updated_at?: Date | null;
}

interface IScheduleTrigger {
  id: string;
  cron: string;
  timezone?: string | null;
  last_triggered?: Date | null;
  updated_at?: Date | null;
}

/**
 * Gets the `last_triggered` of the action.
 */
function getLastRunTime(item: IIntervalTrigger | IScheduleTrigger): Date {
  return new Date(
    item.last_triggered ||
      item.updated_at ||
      DateTime.utc().minus({ minute: 1 }).toJSDate(),
  );
}

/**
 * Retrieves an object with all intervals and schedule actions.
 */
async function getActionsToRun(): Promise<{
  intervals: IIntervalTrigger[];
  schedules: IScheduleTrigger[];
}> {
  const actions = await getActionList({
    filter: { active: true },
    fields: ["trigger", "updated_at", "last_triggered", "type"],
    amount: 999999,
  });

  const intervals: IIntervalTrigger[] = [];
  const schedules: IScheduleTrigger[] = [];

  for (const action of actions) {
    const triggers = Array.isArray(action?.trigger) ? action?.trigger : [];
    for (const item of triggers) {
      if (item.interval) {
        intervals.push({
          id: action.id,
          interval: item.interval,
          last_triggered: action.last_triggered,
          updated_at: action.updated_at,
        });
      } else if (item.cron) {
        schedules.push({
          cron: item.cron,
          id: action.id,
          last_triggered: action.last_triggered,
          timezone: item.timezone,
          updated_at: action.updated_at,
        });
      }
    }
  }

  return { intervals, schedules };
}

/**
 * Triggers the "check" to see if scheduled actions should trigger or not.
 */
async function triggerActionScheduleCheck() {
  try {
    const { intervals, schedules } = await getActionsToRun();
    const actionsToRun = new Set<string>();

    // check intervals
    for (const item of intervals) {
      const lastRunTime = getLastRunTime(item);

      try {
        const dateCalc = parseRelativeDate(item.interval, "plus", lastRunTime);
        if (!dateCalc || dateCalc === "never") {
          continue;
        }

        if (DateTime.utc().plus({ seconds: 30 }).toJSDate() > dateCalc) {
          actionsToRun.add(item.id);
        }
      } catch (error) {
        console.error("Error on interval parser", item.id, error);
      }
    }

    // check schedules
    for (const item of schedules) {
      const lastRunTime = getLastRunTime(item);

      try {
        const timezone = DateTime.now().zoneName;
        const lastTime = DateTime.fromJSDate(lastRunTime).setZone(timezone);
        const cron = cronParser.parseExpression(item.cron, { tz: timezone });
        const cronPrev = cron.prev();

        if (lastTime.toJSDate() < cronPrev.toDate()) {
          actionsToRun.add(item.id);
        }
      } catch (error) {
        console.error("Error on cron parser", item.id, error);
      }
    }

    const actions = [...actionsToRun.values()];
    for (const actionID of actions) {
      await triggerAction(actionID, null);
    }
  } catch (ex) {
    // database may be inactive or something else
  }
}

/**
 * Starts the interval to check schedule triggers.
 */
function startActionScheduleTimer() {
  stopActionScheduleTimer();
  interval = setInterval(triggerActionScheduleCheck, 1000 * 60);
}

function stopActionScheduleTimer() {
  if (interval) {
    clearInterval(interval);
  }
}

export {
  triggerActionScheduleCheck,
  stopActionScheduleTimer,
  startActionScheduleTimer,
};
