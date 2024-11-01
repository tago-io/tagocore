import { describe, expect, test } from "vitest";
import {
  generateResourceID,
  validateResourceID,
} from "../../Shared/ResourceID.ts";
import {
  type IDeviceCreate,
  type IDeviceEdit,
  type IDeviceListQuery,
  type IDeviceParameter,
  zDeviceCreate,
  zDeviceEdit,
  zDeviceListQuery,
  zDeviceParameter,
} from "./Device.types.ts";

describe("zDeviceParameter", () => {
  test("parses simple object", () => {
    const data: IDeviceParameter = { id: "123", key: "", value: "" };
    const parsed = zDeviceParameter.parse(data);
    expect(parsed.key).toEqual("");
  });
});

describe("zDeviceCreate", () => {
  test("parses object with only name", () => {
    const data: IDeviceCreate = { name: "Device #1" };
    const parsed = zDeviceCreate.parse(data);
    expect(validateResourceID(parsed.id)).toEqual(true);
    expect(parsed.name).toEqual("Device #1");
    expect(parsed.tags).toEqual([]);
    expect(parsed.active).toEqual(true);
    expect(parsed.type).toEqual("immutable");
    expect(parsed.payload_parser).toBeUndefined();
    expect(parsed.created_at).toBeInstanceOf(Date);
  });

  test("throws error if name has less than 3 characters", () => {
    const data: IDeviceCreate = { name: "AB" };
    const fn = () => zDeviceCreate.parse(data);
    expect(fn).toThrowError();
  });

  test("parses active as false", () => {
    const data: IDeviceCreate = { name: "Device #1", active: false };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.active).toEqual(false);
  });

  test("parses active as undefined", () => {
    const data: IDeviceCreate = { name: "Device #1", active: undefined };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.active).toEqual(true);
  });

  test("parses active as null", () => {
    const data: IDeviceCreate = { name: "Device #1", active: null };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.active).toEqual(true);
  });

  test("throws error if active is not boolean", () => {
    expect(() =>
      zDeviceCreate.parse({ name: "ABC", active: "abc" }),
    ).toThrowError();
    expect(() =>
      zDeviceCreate.parse({ name: "ABC", active: 123 }),
    ).toThrowError();
  });

  test("ignores created_at", () => {
    const created_at = new Date("2020-01-01T15:00:00Z");
    const data = { name: "Device #1", created_at };
    const parsed = zDeviceCreate.parse(data);
    const diffNow = Date.now() - parsed.created_at.getTime();
    expect(diffNow).toBeLessThan(100);
  });

  test("ignores id", () => {
    const id = generateResourceID();
    const data = { name: "Device #1", id };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.id).not.toEqual(id);
  });

  test("parses tags", () => {
    const data: IDeviceCreate = {
      name: "Device #1",
      tags: [{ key: "hello", value: "world" }],
    };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.tags).toEqual([{ key: "hello", value: "world" }]);
  });

  test("parses tags as undefined", () => {
    const data: IDeviceCreate = { name: "Device #1", tags: undefined };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.tags).toEqual([]);
  });

  test("parses tags as null", () => {
    const data: IDeviceCreate = { name: "Device #1", tags: null };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.tags).toEqual([]);
  });

  test("parses payload_parser", () => {
    const data: IDeviceCreate = {
      name: "Device #1",
      payload_parser: "/parser.js",
    };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.payload_parser).toEqual("/parser.js");
  });

  test("doesn't parse chunk variables if type is mutable", () => {
    const data: IDeviceCreate = {
      name: "Device #1",
      type: "mutable",
      chunk_period: "day",
      chunk_retention: 1,
    };
    const parsed = zDeviceCreate.parse(data);
    expect(parsed.chunk_period).toBeFalsy();
    expect(parsed.chunk_retention).toBeFalsy();
  });

  test("parses different types of retentions", () => {
    const retentions: any = ["0", "12", "36", 0, 12, 36];
    for (const chunk_retention of retentions) {
      const data: IDeviceCreate = {
        name: "Device #1",
        chunk_period: "week",
        chunk_retention,
      };
      const parsed = zDeviceCreate.parse(data);
      expect(parsed.chunk_retention).toEqual(Number(chunk_retention));
    }
  });
});

describe("zDeviceEdit", () => {
  test("parses object with only name", () => {
    const data: IDeviceEdit = { name: "Device #1" };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.name).toEqual("Device #1");
    expect(parsed.active).toBeUndefined();
    expect(parsed.last_input).toBeUndefined();
    expect(parsed.last_output).toBeUndefined();
    expect(parsed.payload_parser).toBeUndefined();
    expect(parsed.tags).toBeUndefined();
    expect(parsed.updated_at).toBeUndefined();
  });

  test("parses active as false", () => {
    const data: IDeviceEdit = { active: false };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.active).toEqual(false);
  });

  test("parses active as undefined", () => {
    const data: IDeviceEdit = { active: undefined };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.active).toBeUndefined();
  });

  test("parses active as null", () => {
    const data: IDeviceEdit = { active: null };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.active).toBeNull();
  });

  test("throws error if active is not boolean", () => {
    expect(() => zDeviceEdit.parse({ active: "abc" })).toThrowError();
    expect(() => zDeviceEdit.parse({ active: 123 })).toThrowError();
  });

  test("ignores id", () => {
    const id = generateResourceID();
    const data = { id };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed).not.toHaveProperty("id");
  });

  test("parses tags", () => {
    const data: IDeviceEdit = { tags: [{ key: "hello", value: "world" }] };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.tags).toEqual([{ key: "hello", value: "world" }]);
  });

  test("parses tags as undefined", () => {
    const data: IDeviceEdit = { tags: undefined };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.tags).toBeUndefined();
  });

  test("parses tags as null", () => {
    const data: IDeviceEdit = { tags: null };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.tags).toBeNull();
  });

  test("throws error if tags is not array", () => {
    expect(() => zDeviceEdit.parse({ tags: false })).toThrowError();
    expect(() => zDeviceEdit.parse({ tags: 123 })).toThrowError();
    expect(() => zDeviceEdit.parse({ tags: "abc" })).toThrowError();
  });

  test("parses payload_parser", () => {
    const data: IDeviceEdit = {
      name: "Device #1",
      payload_parser: "/parser.js",
    };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.payload_parser).toEqual("/parser.js");
  });

  test("parses payload_parser as undefined", () => {
    const data: IDeviceEdit = { payload_parser: undefined };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.payload_parser).toBeUndefined();
  });

  test("parses payload_parser as null", () => {
    const data: IDeviceEdit = { payload_parser: null };
    const parsed = zDeviceEdit.parse(data);
    expect(parsed.payload_parser).toBeNull();
  });

  test("throws error if payload_parser is not a string", () => {
    expect(() => zDeviceEdit.parse({ payload_parser: false })).toThrowError();
    expect(() => zDeviceEdit.parse({ payload_parser: 123 })).toThrowError();
  });
});

describe("zDeviceListQuery", () => {
  test("parses empty object", () => {
    const data: IDeviceListQuery = {};
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed).toEqual({
      page: 1,
      amount: 20,
      fields: ["id", "name", "tags"],
      filter: {},
      orderBy: ["name", "asc"],
    });
  });

  test("parses filter", () => {
    const data: IDeviceListQuery = { filter: { name: "abc" } };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.filter).toEqual({ name: "abc" });
  });

  test("parses filter as empty object", () => {
    const data: IDeviceListQuery = { filter: {} };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("parses filter as undefined", () => {
    const data: IDeviceListQuery = { filter: undefined };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("parses filter as null", () => {
    const data: IDeviceListQuery = { filter: null };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("throws error if filter is not an object", () => {
    expect(() => zDeviceListQuery.parse({ filter: [] })).toThrowError();
    expect(() => zDeviceListQuery.parse({ filter: false })).toThrowError();
    expect(() => zDeviceListQuery.parse({ filter: true })).toThrowError();
    expect(() => zDeviceListQuery.parse({ filter: 123 })).toThrowError();
  });

  test("parses fields", () => {
    const data: IDeviceListQuery = { fields: ["active"] };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.fields).toEqual(["active", "id", "tags"]);
  });

  test("parses all fields available", () => {
    const data: IDeviceListQuery = {
      fields: [
        "id",
        "name",
        "active",
        "payload_parser",
        "last_output",
        "last_input",
        "inspected_at",
        "created_at",
        "updated_at",
        "tags",
      ],
    };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.fields).toEqual(data.fields);
  });

  test("parses fields as empty array", () => {
    const data: IDeviceListQuery = { fields: [] };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.fields).toEqual(["id", "tags"]);
  });

  test("parses fields as undefined", () => {
    const data: IDeviceListQuery = { fields: undefined };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.fields).toEqual(["id", "name", "tags"]);
  });

  test("parses fields as null", () => {
    const data: IDeviceListQuery = { fields: null };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.fields).toEqual(["id", "name", "tags"]);
  });

  test("throws error if filter is not an array", () => {
    expect(() => zDeviceListQuery.parse({ fields: {} })).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: false })).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: true })).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: 123 })).toThrowError();
  });

  test("throws error if filter fields are invalid", () => {
    expect(() => zDeviceListQuery.parse({ fields: ["temp"] })).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ fields: ["abc", "hello"] }),
    ).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: [123] })).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: [null] })).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ fields: [undefined] }),
    ).toThrowError();
    expect(() => zDeviceListQuery.parse({ fields: [{}] })).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ fields: [1, "name"] }),
    ).toThrowError();
  });

  test("parses orderBy", () => {
    const data: IDeviceListQuery = { orderBy: ["active", "asc"] };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.orderBy).toEqual(["active", "asc"]);
  });

  test("parses all orderBy available", () => {
    expect(zDeviceListQuery.parse({ orderBy: ["id", "asc"] }).orderBy).toEqual([
      "id",
      "asc",
    ]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["name", "asc"] }).orderBy,
    ).toEqual(["name", "asc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["active", "asc"] }).orderBy,
    ).toEqual(["active", "asc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["payload_parser", "desc"] }).orderBy,
    ).toEqual(["payload_parser", "desc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["last_output", "desc"] }).orderBy,
    ).toEqual(["last_output", "desc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["last_input", "desc"] }).orderBy,
    ).toEqual(["last_input", "desc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["created_at", "desc"] }).orderBy,
    ).toEqual(["created_at", "desc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["updated_at", "desc"] }).orderBy,
    ).toEqual(["updated_at", "desc"]);
    expect(
      zDeviceListQuery.parse({ orderBy: ["tags", "desc"] }).orderBy,
    ).toEqual(["tags", "desc"]);
  });

  test("parses orderBy as null", () => {
    const data: IDeviceListQuery = { orderBy: null };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("parses orderBy as undefined", () => {
    const data: IDeviceListQuery = { orderBy: undefined };
    const parsed = zDeviceListQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("throws error if orderBy is not a tuple", () => {
    expect(() => zDeviceListQuery.parse({ orderBy: {} })).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: [] })).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: "abc" })).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: true })).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: false })).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: 1234 })).toThrowError();
  });

  test("throws error if orderBy configuration is incorrect", () => {
    expect(() =>
      zDeviceListQuery.parse({ orderBy: [123, "asc"] }),
    ).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ orderBy: ["name", "ASC"] }),
    ).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ orderBy: ["name", "DESC"] }),
    ).toThrowError();
    expect(() =>
      zDeviceListQuery.parse({ orderBy: [true, "asc"] }),
    ).toThrowError();
    expect(() => zDeviceListQuery.parse({ orderBy: ["name"] })).toThrowError();
  });
});
