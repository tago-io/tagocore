import removeNullValues from "./removeNullValues.ts";
import { test, expect, describe } from "vitest";

describe("removeNullValues", () => {
  test("process simple object", () => {
    const data = { key: "value" };
    const process = removeNullValues({ key: "value" });
    expect(process).toEqual(data);
  });

  test("removes null value", () => {
    const data = { key: null };
    const process = removeNullValues(data);
    expect(process).toStrictEqual({});
  });

  test("removes undefined value", () => {
    const data = { key: undefined };
    const process = removeNullValues(data);
    expect(process).toStrictEqual({});
  });
});
