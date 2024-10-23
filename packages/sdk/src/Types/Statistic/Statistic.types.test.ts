import type { ZodError } from "zod";
import { zStatistic, zStatisticCreate } from "./Statistic.types.ts";
import { test, expect, describe } from "vitest";

describe("zStatistic", () => {
  test("parses simple object", () => {
    const data = {
      input: 0,
      output: 1,
      time: new Date(),
    };
    const parsed = zStatistic.parse(data);
    expect(parsed.input).toEqual(0);
  });

  test("assure correct type", () => {
    const data = {
      input: 0,
      output: 1,
      time: 2,
    };
    try {
      zStatistic.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.time[0]).toBe("Expected date, received number");
    }
  });
});

describe("zStatisticCreate", () => {
  test("parses simple object", () => {
    const data = {
      input: 0,
      output: 1,
      time: Date.now(),
    };
    const parsed = zStatisticCreate.parse(data);
    expect(parsed.input).toEqual(0);
  });

  test("check optional fields", () => {
    const data = {
      time: Date.now(),
    };
    const parsed = zStatisticCreate.parse(data);
    expect(parsed.input).toBeUndefined();
    expect(parsed.output).toBeUndefined();
  });
});
