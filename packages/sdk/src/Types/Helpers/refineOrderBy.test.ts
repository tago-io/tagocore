import { refineOrderBy } from "./refineOrderBy.ts";
import { test, expect, describe } from "vitest";

describe("refineOrderBy", () => {
  test("assure correct validation", () => {
    const data = "asc";
    const process = refineOrderBy(data);
    expect(process).toBeTruthy();
  });
});
