import { describe, expect, test } from "vitest";
import { generateResourceID, validateResourceID } from "./ResourceID.ts";

describe("Test generateResourceID", () => {
  test("Generate resource id", () => {
    const id = generateResourceID();
    expect(typeof id).toBe("string");
    expect(id.length).toBe(24);
  });
});

describe("Test validateResourceID", () => {
  test("Id must be valid", () => {
    const valid = validateResourceID("613b84414dda40c58d5a75fc");
    expect(valid).toBeTruthy();
  });

  test("Id must be invalid", () => {
    const valid = validateResourceID("test");
    expect(valid).toBeFalsy();
  });
});
