import { time } from "node:console";
import type { ZodError } from "zod";
import { zLogCreate, zLogList } from "./Log.types.ts";

describe("zLogCreate", () => {
  test("parses simple object", () => {
    const timestamp = new Date();
    const data = {
      timestamp: timestamp,
      message: "message",
      error: true,
    };
    const parsed = zLogCreate.parse(data);
    expect(parsed.message).toEqual("message");
    expect(parsed.error).toEqual(true);
  });

  test("assure correct type", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
      error: "true",
    };
    try {
      zLogCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.error[0]).toBe("Expected boolean, received string");
    }
  });

  test("assign date type", () => {
    const data = {
      timestamp: null,
      message: "message",
      error: true,
    };
    const parsed = zLogCreate.parse(data);
    expect(typeof parsed.timestamp).toBe("object");
  });

  test("fail if required field is missing", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
    };
    try {
      zLogCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.error[0]).toBe("Required");
    }
  });
});

describe("zLogList", () => {
  test("parses simple object", () => {
    const data = [
      {
        timestamp: new Date(),
        message: "message",
        error: true,
      },
    ];
    const parsed = zLogList.parse(data);
    expect(parsed[0].timestamp).toEqual(data[0].timestamp);
    expect(parsed[0].message).toEqual("message");
    expect(parsed[0].error).toEqual(true);
  });

  test("assure it is an array", () => {
    const data = {
      timestamp: Date.now(),
      message: "message",
      error: true,
    };
    try {
      zLogList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({});
    }
  });

  test("check empty array", () => {
    const data = [];
    try {
      zLogList.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toBe("Expected array, received object");
    }
  });
});
