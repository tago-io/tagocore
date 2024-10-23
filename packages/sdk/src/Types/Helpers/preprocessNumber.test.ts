import preprocessNumber from "./preprocessNumber.ts";
import { test, expect, describe } from "vitest";

describe("preprocessNumber", () => {
  test("process string param", () => {
    const data = "123";
    const process = preprocessNumber(data);
    expect(typeof process).toBe("number");
    expect(process).toEqual(123);
  });

  test("filter booleans values", () => {
    const data = true;
    const process = preprocessNumber(data);
    expect(typeof process).toBe("string");
    expect(process).toEqual("");
  });
});
