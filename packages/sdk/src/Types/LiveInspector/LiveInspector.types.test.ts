import type { ZodError } from "zod";
import { zLiveInspectorConnectionID, zLiveInspectorMessage, zLiveInspectorMessageCreate } from "./LiveInspector.types.ts";

describe("zLiveInspectorConnectionID", () => {
  test("parses string", () => {
    const data = "string";
    const parsed = zLiveInspectorConnectionID.parse(data);
    expect(parsed).toEqual("string");
  });

  test("accepts null", () => {
    const data = null;
    const parsed = zLiveInspectorConnectionID.parse(data);
    expect(parsed).toBeNull();
  });
});

describe("zLiveInspectorMessage", () => {
  test("parses simple object", () => {
    const data = {
      connection_id: "connection_id",
      content: "any",
      device_id: "string",
      timestamp: 0,
      title: "title",
    };
    const parsed = zLiveInspectorMessage.parse(data);
    expect(parsed.connection_id).toEqual("connection_id");
    expect(parsed.content).toEqual("any");
    expect(parsed.device_id).toEqual("string");
    expect(parsed.timestamp).toEqual(0);
    expect(parsed.title).toEqual("title");
  });

  test("assure correct type assign", () => {
    const data = {
      connection_id: "connection_id",
      content: "any",
      device_id: 1,
      timestamp: 0,
      title: "title",
    };
    try {
      zLiveInspectorMessage.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.device_id[0]).toBe("Expected string, received number");
    }
  });

  test("check optional field", () => {
    const data = {
      connection_id: "connection_id",
      device_id: "1",
      timestamp: 0,
      title: "title",
    };

    const parsed = zLiveInspectorMessage.parse(data);
    expect(parsed.content).toBeUndefined();
  });
});

describe("zLiveInspectorMessageCreate", () => {
  test("parses simple object", () => {
    const data = {
      content: "any",
      title: "title",
    };
    const parsed = zLiveInspectorMessageCreate.parse(data);
    expect(parsed.content).toEqual("any");
    expect(parsed.title).toEqual("title");
  });

  test("check optional field", () => {
    const data = {
      title: "title",
    };
    try {
      zLiveInspectorMessageCreate.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.content[0]).toBe("Expected any, received undefined");
    }
  });
});
