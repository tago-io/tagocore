import { describe, expect, it } from "vitest";
import splitColon from "./splitColon.ts";

describe("Split Colon", () => {
  it("should split colon", () => {
    const value1 = "value1";
    const value2 = "value2";
    const result = splitColon(`${value1}:${value2}`);
    expect(result[0]).toBe(value1);
    expect(result[1]).toBe(value2);
  });
  it("should have ':' to be able to split", () => {
    const value1 = "value1";
    const value2 = undefined;
    const result = splitColon(`${value1}`);
    expect(result[0]).toBe(value1);
    expect(result[1]).toBe(value2);
  });
});
