import type { ZodError } from "zod";
import { zTag, zTags } from "./Tag.types.ts";

describe("zTag", () => {
  test("parses simple object", () => {
    const data = {
      key: "key",
      value: "value",
    };
    const parsed = zTag.parse(data);
    expect(parsed.key).toEqual("key");
    expect(parsed.value).toEqual("value");
  });

  test("assure correct types.ts", () => {
    const data = {
      key: 0,
      value: "value",
    };
    try {
      zTag.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.key[0]).toBe("Expected string, received number");
    }
  });

  test("check required fields", () => {
    const data = {
      value: "value",
    };
    try {
      zTag.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors.key[0]).toBe("Required");
    }
  });
});

describe("zTags", () => {
  test("parses simple object", () => {
    const data = [
      {
        key: "key",
        value: "value",
      },
    ];
    const parsed = zTags.parse(data);
    expect(parsed[0].key).toEqual("key");
  });

  test("assure correct type", () => {
    const data = {
      key: 0,
      value: "value",
    };
    try {
      zTags.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toStrictEqual({});
    }
  });

  test("error if empty array", () => {
    const data = [];
    try {
      zTags.parse(data);
    } catch (error) {
      const e = (error as ZodError).flatten();
      expect(e.fieldErrors).toBe("Empty");
    }
  });
});
