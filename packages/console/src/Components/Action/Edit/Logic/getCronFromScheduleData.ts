import { DateTime } from "luxon";
import type { IScheduleData } from "../../Action.interface";

function getCronFromScheduleData(scheduleData: IScheduleData) {
  const cron = ["*", "*", "*", "*", "*"];
  const {
    repeat_weekdays,
    repeat_unit,
    repeat_date,
    repeat_type,
    repeat_hour,
  } = scheduleData;

  const day = repeat_date;
  const hour = DateTime.fromFormat(repeat_hour as string, "HH:mm").toFormat(
    "HH",
  );
  const minute = DateTime.fromFormat(repeat_hour as string, "HH:mm").toFormat(
    "mm",
  );
  let showWeekdays = true;

  cron[0] = minute;
  cron[1] = hour;

  if (repeat_type === "day") {
    cron[2] = `*/${repeat_unit}`;
    showWeekdays = Number(repeat_unit) <= 1;
  } else if (repeat_type === "week") {
    const days = Number(repeat_unit) * 7;
    cron[2] = `*/${days}`;
    showWeekdays = true;
  } else if (repeat_type === "month") {
    cron[2] = day as string;
    cron[3] = `*/${repeat_unit}`;
    showWeekdays = false;
  }

  if (repeat_weekdays && showWeekdays) {
    const weekdays: string[] = [];
    for (const key in repeat_weekdays) {
      if ((repeat_weekdays as any)[key]) {
        weekdays.push(key.substring(0, 3));
      }
    }
    cron[4] = weekdays.length > 0 ? weekdays.join(",") : "*";
  }

  const cronJoined = cron.join(" ");
  return cronJoined;
}

export { getCronFromScheduleData };
