import preprocessObject from "./preprocessObject.ts";
import { test, expect, describe } from "vitest";

describe("preprocessObject", () => {
  test("process simple object", () => {
    const data = { key: "value" };
    const process = preprocessObject({ key: "value" });
    expect(process).toStrictEqual(data);
  });

  test("process non object to object", () => {
    const data = "key, value";
    const process = preprocessObject(data);
    expect(typeof process).toBe("object");
  });
});
