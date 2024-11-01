import { describe, expect, test } from "vitest";
import { validateResourceID } from "../../Shared/ResourceID.ts";
import {
  type IActionTypePost,
  type IActionTypeScript,
  type IActionTypeTagoIO,
  zActionTypePost,
  zActionTypeScript,
  zActionTypeTagoIO,
} from "../index.ts";
import { zActionCreate } from "./Action.types.ts";

describe("zActionCreate", () => {
  test("parses simple object", () => {
    const data: any = { type: "condition", name: "Action #1" };
    const parsed = zActionCreate.parse(data);
    expect(validateResourceID(parsed.id)).toEqual(true);
    expect(parsed.name).toEqual("Action #1");
    expect(parsed.tags).toEqual([]);
    expect(parsed.active).toEqual(true);
    expect(parsed.created_at).toBeInstanceOf(Date);
  });

  test("parses object with type 'condition'", () => {
    const data: any = { type: "condition", name: "Action #1" };
    const parsed = zActionCreate.parse(data);
    expect(parsed.type).toEqual(data.type);
  });

  test("parses object with type 'interval'", () => {
    const data: any = { type: "interval", name: "Action #1" };
    const parsed = zActionCreate.parse(data);
    expect(parsed.type).toEqual(data.type);
  });

  test("parses object with type 'interval'", () => {
    const data: any = { type: "interval", name: "Action #1" };
    const parsed = zActionCreate.parse(data);
    expect(parsed.type).toEqual(data.type);
  });

  test("parses object with valid custom module type", () => {
    const pluginType = "7c713c7aace7bda2583a1cb19e873d02:sample-module";
    const data: any = { type: pluginType, name: "Action #1" };
    const parsed = zActionCreate.parse(data);
    expect(parsed.type).toEqual(data.type);
  });

  test("parses object with invalid Plugin ID in module type", () => {
    const pluginType = "ABC:sample-module";
    const data: any = { type: pluginType, name: "Action #1" };
    const fn = () => zActionCreate.parse(data);
    expect(fn).toThrowError("Invalid Plugin ID");
  });

  test("parses object with invalid Module ID in module type", () => {
    const pluginType = "7c713c7aace7bda2583a1cb19e873d02:";
    const data: any = { type: pluginType, name: "Action #1" };
    const fn = () => zActionCreate.parse(data);
    expect(fn).toThrowError("Invalid Module ID");
  });

  test("parses object with invalid Module ID in module type", () => {
    const pluginType = "7c713c7aace7bda2583a1cb19e873d02:";
    const data: any = { type: pluginType, name: "Action #1" };
    const fn = () => zActionCreate.parse(data);
    expect(fn).toThrowError("Invalid Module ID");
  });
});

describe("zActionTypeScript", () => {
  test("parses simple script object", () => {
    const data: IActionTypeScript = { type: "script", script: [] };
    const parsed = zActionTypeScript.parse(data);
    expect(parsed).toEqual(data);
  });

  test("throws error if script is not present", () => {
    const data = { type: "script" };
    const fn = () => zActionTypeScript.parse(data);
    expect(fn).toThrow();
  });

  test("throws error if script is a number", () => {
    const data = { type: "script", script: 1 };
    const fn = () => zActionTypeScript.parse(data);
    expect(fn).toThrow();
  });

  test("allows script to be an object id", () => {
    const data = { type: "script", script: "6278ef13c5b6db00139e0149" };
    const parsed = zActionTypeScript.parse(data);
    expect(parsed).toEqual(data);
  });

  test("allows script to be an array of object ids", () => {
    const script = ["6278ef13c5b6db00139e0149", "6278ef13c5b6db00139e0149"];
    const data = { type: "script", script };
    const parsed = zActionTypeScript.parse(data);
    expect(parsed).toEqual(data);
  });
});

describe("zActionTypeTagoIO", () => {
  test("parses simple tagoio object", () => {
    const data: IActionTypeTagoIO = {
      type: "tagoio",
      token: "1014121a-d123-4a56-789a-c16b4be056fa",
    };
    const parsed = zActionTypeTagoIO.parse(data);
    expect(parsed).toEqual(data);
  });

  test("throws error if token is a number", () => {
    const data: IActionTypeTagoIO = { type: "tagoio", token: 1 as any };
    const fn = () => zActionTypeTagoIO.parse(data);
    expect(fn).toThrow();
  });

  test("throws error if token is not an uuid", () => {
    const data: IActionTypeTagoIO = {
      type: "tagoio",
      token: "1014121a-c16b4be056",
    };
    const fn = () => zActionTypeTagoIO.parse(data);
    expect(fn).toThrow();
  });
});

describe("zActionTypePost", () => {
  test("parses simple post object", () => {
    const data: IActionTypePost = {
      type: "post",
      url: "http://localhost:8888",
    };
    const parsed = zActionTypePost.parse(data);
    expect(parsed).toEqual(data);
  });

  test("allows headers", () => {
    const data: IActionTypePost = {
      type: "post",
      url: "http://localhost:8888",
      headers: { token: "abc" },
    };
    const parsed = zActionTypePost.parse(data);
    expect(parsed).toEqual(data);
  });

  test("allows fallback_token", () => {
    const data: IActionTypePost = {
      type: "post",
      url: "http://localhost:8888",
      fallback_token: "1014121a-d123-4a56-789a-c16b4be056fa",
    };
    const parsed = zActionTypePost.parse(data);
    expect(parsed).toEqual(data);
  });

  test("throws error if fallback_token is not an uuid", () => {
    const data: IActionTypePost = {
      type: "post",
      url: "hello world",
      fallback_token: 1 as any,
    };
    const fn = () => zActionTypePost.parse(data);
    expect(fn).toThrow();
  });

  test("throws error if url is not a valid url", () => {
    const data: IActionTypePost = { type: "post", url: "hello world" };
    const fn = () => zActionTypePost.parse(data);
    expect(fn).toThrow();
  });

  test("throws error if url is missing", () => {
    const data = { type: "post" };
    const fn = () => zActionTypePost.parse(data);
    expect(fn).toThrow();
  });
});
