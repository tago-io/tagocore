import { describe, expect, test } from "vitest";
import type { ZodError } from "zod";
import { zComputerUsage, zNetworkInfo, zOSInfo } from "./Hardware.types.ts";

describe("zOSInfo", () => {
  test("parses simple object", () => {
    const data = {
      version: "version",
      arch: "arch",
      name: "name",
      code: "linux",
      hardware: "hardware",
      hostname: "hostname",
    };
    const parsed = zOSInfo.parse(data);
    expect(parsed.version).toEqual("version");
  });

  test("check required fields", () => {
    const data = {
      version: "version",
    };
    try {
      zOSInfo.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.arch[0]).toBe("Required");
    }
  });

  test("error if invalid code", () => {
    const data = {
      version: "version",
      arch: "arch",
      name: "name",
      code: " ",
      hardware: "hardware",
      hostname: "hostname",
    };
    try {
      zOSInfo.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(
        e.fieldErrors.code[0].startsWith("Invalid enum value."),
      ).toBeTruthy();
    }
  });
});

describe("zNetworkInfo", () => {
  test("parses simple object", () => {
    const data = {
      name: "name",
      ip: "ip",
      bytesTransferred: 0,
      bytesDropped: 0,
    };
    const parsed = zNetworkInfo.parse(data);
    expect(parsed.name).toEqual("name");
  });

  test("check required fields", () => {
    const data = {
      name: "name",
    };
    try {
      zNetworkInfo.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.ip[0]).toBe("Required");
    }
  });

  test("assure correct field types.ts", () => {
    const data = {
      name: "name",
      ip: 0,
      bytesTransferred: "bytesTransferred",
      bytesDropped: 0,
    };
    try {
      zNetworkInfo.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.ip[0]).toBe("Expected string, received number");
    }
  });
});

describe("zComputerUsage", () => {
  test("parses simple object", () => {
    const data = {
      description: "string", // undefined
      detail: "detail", // undefined
      type: "type",
      total: 0,
      used: 1,
      title: "title",
    };
    const parsed = zComputerUsage.parse(data);
    expect(parsed.type).toEqual("type");
  });

  test("check required fields", () => {
    const data = {
      description: "string", // undefined
      detail: "detail", // undefined
      type: "type",
    };
    try {
      zComputerUsage.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.title[0]).toBe("Required");
    }
  });

  test("parses without optional fields", () => {
    const data = {
      type: "type",
      total: 0,
      used: 1,
      title: "title",
    };
    const parsed = zComputerUsage.parse(data);
    expect(parsed.description).toBeUndefined();
    expect(parsed.detail).toBeUndefined();
  });
});
