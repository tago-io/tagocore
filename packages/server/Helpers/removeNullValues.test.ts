import { describe, expect, it } from "vitest";
import removeNullValues from "./removeNullValues.ts";

describe("Remove Null Values", () => {
  it("should remove null values from an object", () => {
    const value = { variable: "temperature", value: 12, group: null };
    const result = removeNullValues(value);
    expect(result).toEqual({ variable: "temperature", value: 12 });
  });
  it("should remove null values from an object", () => {
    const value = { variable: "temperature", value: 12, group: undefined };
    const result = removeNullValues(value);
    expect(result).toEqual({ variable: "temperature", value: 12 });
  });
});
