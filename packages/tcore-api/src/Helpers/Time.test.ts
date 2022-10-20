import { fixDurationMoment, parseRelativeDate } from "./Time";

describe("Fix Duration Moment", () => {
  it("should fix the duration", () => {
    const duration = "S";
    const result = fixDurationMoment(duration);
    expect(result).toBe("millisecond");
  });
  it("should fix the duration", () => {
    const duration = "SS";
    const result = fixDurationMoment(duration);
    expect(result).toBe("milliseconds");
  });
  it("should fix the duration", () => {
    const duration = "s";
    const result = fixDurationMoment(duration);
    expect(result).toBe("second");
  });
  it("should fix the duration", () => {
    const duration = "ss";
    const result = fixDurationMoment(duration);
    expect(result).toBe("seconds");
  });
  it("should fix the duration", () => {
    const duration = "m";
    const result = fixDurationMoment(duration);
    expect(result).toBe("minute");
  });
  it("should fix the duration", () => {
    const duration = "mm";
    const result = fixDurationMoment(duration);
    expect(result).toBe("minutes");
  });
  it("should fix the duration", () => {
    const duration = "h";
    const result = fixDurationMoment(duration);
    expect(result).toBe("hour");
  });
  it("should fix the duration", () => {
    const duration = "hh";
    const result = fixDurationMoment(duration);
    expect(result).toBe("hours");
  });
  it("should fix the duration", () => {
    const duration = "d";
    const result = fixDurationMoment(duration);
    expect(result).toBe("day");
  });
  it("should fix the duration", () => {
    const duration = "dd";
    const result = fixDurationMoment(duration);
    expect(result).toBe("days");
  });
  it("should fix the duration", () => {
    const duration = "w";
    const result = fixDurationMoment(duration);
    expect(result).toBe("week");
  });
  it("should fix the duration", () => {
    const duration = "ww";
    const result = fixDurationMoment(duration);
    expect(result).toBe("weeks");
  });
  it("should fix the duration", () => {
    const duration = "M";
    const result = fixDurationMoment(duration);
    expect(result).toBe("month");
  });
  it("should fix the duration", () => {
    const duration = "MM";
    const result = fixDurationMoment(duration);
    expect(result).toBe("months");
  });
  it("should fix the duration", () => {
    const duration = "y";
    const result = fixDurationMoment(duration);
    expect(result).toBe("year");
  });
  it("should fix the duration", () => {
    const duration = "yy";
    const result = fixDurationMoment(duration);
    expect(result).toBe("years");
  });
});

describe("Parse Relative Date", () => {
  it("should parse relative date using plus operator for milliseconds", () => {
    const expireTime = "40 milliseconds";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T03:00:00.040Z");
  });
  it("should parse relative date using plus operator for seconds", () => {
    const expireTime = "30 seconds";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T03:00:30.000Z");
  });
  it("should parse relative date using plus operator for minutes", () => {
    const expireTime = "15 minutes";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T03:15:00.000Z");
  });
  it("should parse relative date using plus operator for hours", () => {
    const expireTime = "12 hours";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T15:00:00.000Z");
  });
  it("should parse relative date using plus operator for days", () => {
    const expireTime = "9 days";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-10T03:00:00.000Z");
  });
  it("should parse relative date using plus operator for weeks", () => {
    const expireTime = "6 weeks";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-02-12T03:00:00.000Z");
  });
  it("should parse relative date using plus operator for months", () => {
    const expireTime = "12 months";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2022-01-01T03:00:00.000Z");
  });
  it("should parse relative date using plus operator for years", () => {
    const expireTime = "3 years";
    const operation = "plus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2024-01-01T03:00:00.000Z");
  });
  it("should parse relative date using minus operator for milliseconds", () => {
    const expireTime = "20 SS";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T02:59:59.980Z");
  });
  it("should parse relative date using minus operator for seconds", () => {
    const expireTime = "60 sec";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T02:59:00.000Z");
  });
  it("should parse relative date using minus operator for minutes", () => {
    const expireTime = "15 min";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2021-01-01T02:45:00.000Z");
  });
  it("should parse relative date using minus operator for hours", () => {
    const expireTime = "32 hh";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);
    expect((result as Date).toISOString()).toBe("2020-12-30T19:00:00.000Z");
  });
  it("should parse relative date using minus operator for days", () => {
    const expireTime = "5 dd";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);

    expect((result as Date).toISOString()).toBe("2020-12-27T03:00:00.000Z");
  });
  it("should parse relative date using minus operator for weeks", () => {
    const expireTime = "9 ww";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);

    expect((result as Date).toISOString()).toBe("2020-10-30T03:00:00.000Z");
  });
  it("should parse relative date using minus operator for months", () => {
    const expireTime = "6 MM";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);

    expect((result as Date).toISOString()).toBe("2020-07-01T03:00:00.000Z");
  });
  it("should parse relative date using minus operator for years", () => {
    const expireTime = "5 yy";
    const operation = "minus";
    const fromDate = new Date(2021, 0, 1);
    const result = parseRelativeDate(expireTime, operation, fromDate);

    expect((result as Date).toISOString()).toBe("2016-01-01T02:00:00.000Z");
  });
  it("should return never", () => {
    const expireTime = "Never";
    const operation = "plus";
    const result = parseRelativeDate(expireTime, operation);
    expect(result).toBe("never");
  });
  it("should split the expireTime string", () => {
    const expireTime = "5 months";
    const operation = "plus";
    const fn = () => parseRelativeDate(expireTime, operation);
    expect(fn).resolves;
  });
  it("should have a number to split the expireTime string", () => {
    const expireTime = "months";
    const operation = "plus";
    const fn = () => parseRelativeDate(expireTime, operation);
    expect(fn).rejects.toThrowError("Invalid relative time");
  });
  it("should have a valid time", () => {
    const expireTime = "3 days";
    const operation = "plus";
    const fromDate = new Date(1, 10, 2020);
    const fn = () => parseRelativeDate(expireTime, operation, fromDate);
    expect(fn).rejects.toThrowError("Invalid relative time");
  });
});
