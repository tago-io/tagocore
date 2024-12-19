import { DateTime } from "luxon";

export function convertDateToISO(date: Date | string, timezone?: string) {
  const rawDate = DateTime.fromJSDate(new Date(date));
  if (timezone) {
    return (
      rawDate.setZone(timezone, { keepLocalTime: true }).toISO() ||
      rawDate.toISO() ||
      DateTime.utc().toISO()
    );
  }
  return (
    rawDate.setZone("UTC", { keepLocalTime: true }).toISO() ||
    DateTime.utc().toISO()
  );
}

const durationLabelsStandard: Record<string, string> = {
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

function fixDuration(rawDuration: string | null | undefined) {
  const duration = String(rawDuration || "").trim();

  return durationLabelsStandard[duration] || duration;
}

export function parseRelativeDate(
  expireTime: string | null | undefined,
  operation: "plus" | "minus",
  fromDate = new Date(),
) {
  if (!expireTime) {
    return;
  }

  if (expireTime.toLowerCase() === "never") {
    return "never";
  }

  const regex = /(\d+)/g;
  const splitTime = expireTime.split(regex);

  if (splitTime.length !== 3 || !splitTime[1] || !splitTime[2]) {
    throw new Error("Invalid date");
  }

  let time: DateTime;
  if (operation === "minus") {
    time = DateTime.fromJSDate(new Date(fromDate)).minus({
      [fixDuration(splitTime[2])]: Number(splitTime[1]),
    });
  } else {
    time = DateTime.fromJSDate(new Date(fromDate)).plus({
      [fixDuration(splitTime[2])]: Number(splitTime[1]),
    });
  }

  if (!time.isValid) {
    throw new Error("Invalid date");
  }

  return time.toJSDate();
}
