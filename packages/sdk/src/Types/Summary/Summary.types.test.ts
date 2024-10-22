import type { ZodError } from "zod";
import { zSummary } from "./Summary.types.ts";
import { describe, test, expect } from "vitest";

describe("zSummary", () => {
  test("parses simple object", () => {
    const data = {
      device: 1,
      analysis: 2,
      action: 3,
    };
    const parsed = zSummary.parse(data);
    expect(parsed.device).toEqual(1);
  });

  test("assure correct types.ts", () => {
    const data = {
      device: " ",
      analysis: " ",
      action: " ",
    };
    try {
      zSummary.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.device[0]).toBe("Expected number, received string");
    }
  });

  test("check required fields", () => {
    const data = {
      device: 1,
    };
    try {
      zSummary.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.analysis[0]).toBe("Required");
      expect(e.fieldErrors.action[0]).toBe("Required");
    }
  });
});
