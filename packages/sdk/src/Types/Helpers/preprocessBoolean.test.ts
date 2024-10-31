import preprocessBoolean from "./preprocessBoolean.ts";
import { test, expect, describe } from "vitest";

describe("preprocessBoolean", () => {
  test("process standard boolean", () => {
    const data = true;
    const process = preprocessBoolean(data);
    expect(process).toEqual(data);
  });

  test("process literal boolean", () => {
    const data = "true";
    const process = preprocessBoolean(data);
    expect(typeof process).toBe("boolean");
    expect(process).toEqual(true);
  });

  test("return true", () => {
    const data = "0";
    const process = preprocessBoolean(data);
    expect(process).toBeTruthy();
  });
});
