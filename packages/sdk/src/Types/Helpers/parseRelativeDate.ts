import { DateTime } from "luxon";

/**
 */
export function convertDateToISO(date: Date | string, timezone?: string) {
  const rawDate = DateTime.fromJSDate(new Date(date));
  if (timezone) {
    return rawDate.setZone(timezone, { keepLocalTime: true }).toISO() || rawDate.toISO() || DateTime.utc().toISO();
  }
    return rawDate.setZone("UTC", { keepLocalTime: true }).toISO() || DateTime.utc().toISO();
}

/**
 */
const durationLabelsStandard = {
  S: "millisecond",
  SS: "milliseconds",
  s: "second",
  ss: "seconds",
  sec: "seconds",
  m: "minute",
  mm: "minutes",
  min: "minutes",
  h: "hour",
  hh: "hours",
  d: "day",
  dd: "days",
  w: "week",
  ww: "weeks",
  M: "month",
  MM: "months",
  y: "year",
  yy: "years",
};

/**
 */
function fixDuration(duration: string) {
  duration = String(duration || "").trim();
  return durationLabelsStandard[duration] || duration;
}

/**
 */
export function parseRelativeDate(expire_time, bool_minus, date = new Date()) {
  if (!expire_time) {
    return;
  }
  if (expire_time.toLowerCase() === "never") {
    return "never";
  }

  const regex = /(\d+)/g;
  const split = expire_time.split(regex);

  if (split.length !== 3 || !split[1] || !split[2]) {
    throw new Error("Invalid date");
  }

  let time: DateTime;
  if (bool_minus) {
    time = DateTime.fromJSDate(new Date(date)).minus({ [fixDuration(split[2])]: Number(split[1]) });
  } else {
    time = DateTime.fromJSDate(new Date(date)).plus({ [fixDuration(split[2])]: Number(split[1]) });
  }

  if (!time.isValid) {
    throw new Error("Invalid date");
  }

  return time.toJSDate();
}
