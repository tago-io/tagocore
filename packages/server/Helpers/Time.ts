import { DateTime } from "luxon";

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

function fixDurationMoment(duration: string) {
  duration = String(duration || "").trim();
  return durationLabelsStandard[duration] || duration;
}

function parseRelativeDate(
  expireTime: string | undefined,
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
  const splitted = expireTime.split(regex);

  if (splitted.length !== 3 || !splitted[1] || !splitted[2]) {
    throw new Error("Invalid relative time");
  }

  let time: DateTime;

  if (operation === "minus") {
    time = DateTime.fromJSDate(new Date(fromDate)).minus({
      [fixDurationMoment(splitted[2])]: Number(splitted[1]),
    });
  } else {
    time = DateTime.fromJSDate(new Date(fromDate)).plus({
      [fixDurationMoment(splitted[2])]: Number(splitted[1]),
    });
  }

  if (!time.isValid) {
    throw new Error("Invalid relative time");
  }

  return time.toJSDate();
}

export { parseRelativeDate, fixDurationMoment };
