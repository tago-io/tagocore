import type { IScheduleData } from "../../Action.interface";

function spreadCronToScheduleData(cron: string, scheduleData: IScheduleData): void {
  if (!cron) {
    return;
  }

  try {
    scheduleData.canRender = true;

    const cronSplitted = cron.split(" ");
    if (cronSplitted.length !== 5) {
      // more or less than 5 parts to the cron
      throw new Error();
    }

    const cronMinute = cronSplitted[0];
    const cronHour = cronSplitted[1];
    const cronDay = cronSplitted[2];
    const cronMonth = cronSplitted[3];
    const cronWeekday = cronSplitted[4];
    const isDayComplex = cronDay.includes("-") || cronDay.includes(",") || cronDay.includes("/");
    const isMonthComplex =
      cronMonth.includes("-") || cronMonth.includes(",") || cronMonth.includes("/");

    if (isDayComplex && isMonthComplex) {
      // we can't work with 'every x days AND every x months'
      throw new Error("day and month too complex");
    }
    if (cronDay !== "*" && !cronMonth.startsWith("*")) {
      // can't work with specific months with a specific day
      throw new Error("day and month combination");
    }
    if (cronDay === "*" && cronMonth.startsWith("*/")) {
      // can't work 'every x months' without a specific day
      throw new Error("applying every month without a specific day");
    }
    if (cronWeekday.includes("-") || cronWeekday.includes("/")) {
      // can't work with complex structure in the weekdays
      throw new Error("weekdays too complex");
    }
    if (cronHour.includes(",") || cronHour.includes("-")) {
      // we need to know the exact hour and minute
      throw new Error("hour too complex");
    }
    if (cronMinute.includes(",") || cronMinute.includes("-")) {
      // we need to know the exact hour and minute
      throw new Error("minute too complex");
    }
    if (cronHour === "*" || cronMinute === "*") {
      // we need to know the exact hour and minute
      throw new Error("minute or hour too complex");
    }
    if (cronDay.includes("-") || cronDay.includes(",")) {
      throw new Error("day too complex");
    }

    const repeatWeekdays = {
      Friday: false,
      Monday: false,
      Saturday: false,
      Sunday: false,
      Thursday: false,
      Tuesday: false,
      Wednesday: false,
    };
    let repeatHour = scheduleData.repeat_hour;
    let repeatType = scheduleData.repeat_type;
    let repeatUnit = scheduleData.repeat_unit;
    let repeatDate = scheduleData.repeat_date;

    let hasWeekday = false;
    const weekdaysSplitted = cronWeekday.replace(/\s+/g, "").split(",");
    for (const weekday of weekdaysSplitted) {
      switch (weekday.toLowerCase()) {
        case "0":
        case "sun":
          repeatWeekdays.Sunday = true;
          break;
        case "1":
        case "mon":
          repeatWeekdays.Monday = true;
          break;
        case "2":
        case "tue":
          repeatWeekdays.Tuesday = true;
          break;
        case "3":
        case "wed":
          repeatWeekdays.Wednesday = true;
          break;
        case "4":
        case "thu":
          repeatWeekdays.Thursday = true;
          break;
        case "5":
        case "fri":
          repeatWeekdays.Friday = true;
          break;
        case "6":
        case "sat":
          repeatWeekdays.Saturday = true;
          break;
        default:
          continue;
      }
      hasWeekday = true;
    }

    repeatHour = `${cronHour.padStart(2, "0")}:${cronMinute.padStart(2, "0")}`; // 4:20 for example

    if (cronDay?.startsWith("*")) {
      repeatType = "day"; // by default
      repeatUnit = "1"; // 1 by default

      if (cronDay.includes("*/")) {
        // is doing 'every x day'
        repeatUnit = cronDay.split("/")[1];
      }

      const repeatUnitAsNumber = Number(repeatUnit);
      const isTypeWeek = repeatUnitAsNumber > 1 && repeatUnitAsNumber % 7 === 0;
      if (isTypeWeek) {
        // divisible by 7 and greater than one
        repeatType = "week";
        repeatUnit = String(repeatUnitAsNumber / 7);
      } else if (repeatUnitAsNumber > 1 && hasWeekday) {
        // if we're not type 'week' then we can't have weekdays with more than one day difference
        throw new Error();
      }
    } else {
      // handles month
      repeatType = "month";
      repeatDate = cronDay;
      repeatUnit = "1"; // 1 by default

      if (hasWeekday) {
        throw new Error("cant have weekdays with months");
      }
      if (cronMonth.includes("*/")) {
        // is doing 'every x months'
        repeatUnit = cronMonth.split("/")[1];
      }
    }

    scheduleData.repeat_weekdays = repeatWeekdays;
    scheduleData.repeat_hour = repeatHour || scheduleData.repeat_hour;
    scheduleData.repeat_type = repeatType || scheduleData.repeat_type;
    scheduleData.repeat_unit = Number(repeatUnit || scheduleData.repeat_unit);
    scheduleData.repeat_date = repeatDate || scheduleData.repeat_date;
  } catch (ex) {
    scheduleData.canRender = false;
  }
}

export { spreadCronToScheduleData };
