import { describe, expect, test } from "vitest";
import { convertDateToISO, parseRelativeDate } from "./parseRelativeDate.ts";

describe("convertDateToISO", () => {
  test("convert simple date", () => {
    const data = convertDateToISO("01/01/01");
    expect(typeof data).toBe("string");
  });
});

describe("parseRelativeDate", () => {
  test("check invalid date", () => {
    try {
      parseRelativeDate(" ", " ");
    } catch (e: any) {
      expect(e.message).toBe("Invalid date");
    }
  });
});
