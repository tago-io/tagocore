import { describe, expect, test } from "vitest";
import { validateResourceID } from "../index.ts";
import {
  type IQuery,
  zActiveAutoGen,
  zDateAutoGen,
  zObjectIDAutoGen,
  zQuery,
  zTagsAutoGen,
} from "./Common.types.ts";

describe("zTagsAutoGen", () => {
  test("parses null", () => {
    const parsed = zTagsAutoGen.parse(null);
    expect(parsed).toEqual([]);
  });

  test("parses undefined", () => {
    const parsed = zTagsAutoGen.parse(undefined);
    expect(parsed).toEqual([]);
  });

  test("parses empty array", () => {
    const parsed = zTagsAutoGen.parse([]);
    expect(parsed).toEqual([]);
  });

  test("parses correct array", () => {
    const parsed = zTagsAutoGen.parse([{ key: "hello", value: "world" }]);
    expect(parsed).toEqual([{ key: "hello", value: "world" }]);
  });

  test("throws error if key is missing", () => {
    const fn = () => zTagsAutoGen.parse([{ value: "world" }]);
    expect(fn).toThrowError();
  });

  test("throws error if value is missing", () => {
    const fn = () => zTagsAutoGen.parse([{ key: "hello" }]);
    expect(fn).toThrowError();
  });

  test("doesn't throw if key is empty", () => {
    const parsed = zTagsAutoGen.parse([{ key: "", value: "world" }]);
    expect(parsed).toEqual([{ key: "", value: "world" }]);
  });

  test("doesn't throw if value is empty", () => {
    const parsed = zTagsAutoGen.parse([{ key: "hello", value: "" }]);
    expect(parsed).toEqual([{ key: "hello", value: "" }]);
  });
});

describe("zActiveAutoGen", () => {
  test("parses null", () => {
    const parsed = zActiveAutoGen.parse(null);
    expect(parsed).toEqual(true);
  });

  test("parses undefined", () => {
    const parsed = zActiveAutoGen.parse(undefined);
    expect(parsed).toEqual(true);
  });

  test("parses false", () => {
    const parsed = zActiveAutoGen.parse(false);
    expect(parsed).toEqual(false);
  });

  test("parses true", () => {
    const parsed = zActiveAutoGen.parse(true);
    expect(parsed).toEqual(true);
  });

  test("throws error if value is a number", () => {
    const fn = () => zTagsAutoGen.parse(1);
    expect(fn).toThrowError();
  });

  test("throws error if value is a string", () => {
    const fn = () => zTagsAutoGen.parse("true");
    expect(fn).toThrowError();
  });
});

describe("zDateAutoGen", () => {
  test("parses null", () => {
    const parsed = zDateAutoGen.parse(null);
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });

  test("parses undefined", () => {
    const parsed = zDateAutoGen.parse(undefined);
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });

  test("always generates a new date", () => {
    const parsed = zDateAutoGen.parse(new Date("2020-01-01"));
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });
});

describe("zDateAutoGen", () => {
  test("parses null", () => {
    const parsed = zDateAutoGen.parse(null);
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });

  test("parses undefined", () => {
    const parsed = zDateAutoGen.parse(undefined);
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });

  test("always generates a new date", () => {
    const parsed = zDateAutoGen.parse(new Date("2020-01-01"));
    const diffNow = Date.now() - parsed.getTime();
    expect(diffNow).toBeLessThan(100);
  });
});

describe("zObjectIDAutoGen", () => {
  test("parses null", () => {
    const parsed = zObjectIDAutoGen.parse(null);
    expect(validateResourceID(parsed)).toEqual(true);
  });

  test("parses undefined", () => {
    const parsed = zObjectIDAutoGen.parse(null);
    expect(validateResourceID(parsed)).toEqual(true);
  });

  test("always generates a new date", () => {
    const parsed = zObjectIDAutoGen.parse(null);
    expect(validateResourceID(parsed)).toEqual(true);
  });
});

describe("zQuery", () => {
  test("parses empty object", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed).toEqual({
      page: 1,
      amount: 20,
      fields: [],
      filter: {},
      orderBy: ["name", "asc"],
    });
  });

  test("parses page correctly", () => {
    const data: IQuery = { page: 10 };
    const parsed = zQuery.parse(data);
    expect(parsed.page).toEqual(10);
  });

  test("parses empty page", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed.page).toEqual(1);
  });

  test("parses page as null", () => {
    const data: IQuery = { page: null };
    const parsed = zQuery.parse(data);
    expect(parsed.page).toEqual(1);
  });

  test("parses page as undefined", () => {
    const data: IQuery = { page: undefined };
    const parsed = zQuery.parse(data);
    expect(parsed.page).toEqual(1);
  });

  test("parses page as string", () => {
    const data = { page: "12" };
    const parsed = zQuery.parse(data);
    expect(parsed.page).toEqual(12);
  });

  test("throws error if page is not a number", () => {
    expect(() => zQuery.parse({ page: "abc" })).toThrowError();
    expect(() => zQuery.parse({ page: true })).toThrowError();
    expect(() => zQuery.parse({ page: false })).toThrowError();
  });

  test("doesn't allow negative amounts", () => {
    const data: IQuery = { amount: -2 };
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(0);
  });

  test("parses amount correctly", () => {
    const data: IQuery = { amount: 10 };
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(10);
  });

  test("parses empty amount", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(20);
  });

  test("parses amount as null", () => {
    const data: IQuery = { amount: null };
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(20);
  });

  test("parses amount as undefined", () => {
    const data: IQuery = { amount: undefined };
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(20);
  });

  test("parses amount as string", () => {
    const data = { amount: "12" };
    const parsed = zQuery.parse(data);
    expect(parsed.amount).toEqual(12);
  });

  test("throws error if amount is not a number", () => {
    expect(() => zQuery.parse({ amount: "abc" })).toThrowError();
    expect(() => zQuery.parse({ amount: true })).toThrowError();
    expect(() => zQuery.parse({ amount: false })).toThrowError();
  });

  test("parses fields correctly", () => {
    const data: IQuery = { fields: ["id", "last_input"] };
    const parsed = zQuery.parse(data);
    expect(parsed.fields).toEqual(["id", "last_input"]);
  });

  test("parses empty fields", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed.fields).toEqual([]);
  });

  test("parses fields as null", () => {
    const data: IQuery = { fields: null };
    const parsed = zQuery.parse(data);
    expect(parsed.fields).toEqual([]);
  });

  test("parses fields as undefined", () => {
    const data: IQuery = { fields: undefined };
    const parsed = zQuery.parse(data);
    expect(parsed.fields).toEqual([]);
  });

  test("throws error if fields is not an array", () => {
    expect(() => zQuery.parse({ fields: "abc" })).toThrowError();
    expect(() => zQuery.parse({ fields: true })).toThrowError();
    expect(() => zQuery.parse({ fields: false })).toThrowError();
    expect(() => zQuery.parse({ fields: 1234 })).toThrowError();
  });

  test("parses filter correctly", () => {
    const data: IQuery = { filter: { name: "myDevice" } };
    const parsed = zQuery.parse(data);
    expect(parsed.filter).toEqual({ name: "myDevice" });
  });

  test("parses empty filter", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("parses filter as null", () => {
    const data: IQuery = { filter: null };
    const parsed = zQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("parses filter as undefined", () => {
    const data: IQuery = { filter: undefined };
    const parsed = zQuery.parse(data);
    expect(parsed.filter).toEqual({});
  });

  test("throws error if filter is not an object", () => {
    expect(() => zQuery.parse({ filter: [] })).toThrowError();
    expect(() => zQuery.parse({ filter: "abc" })).toThrowError();
    expect(() => zQuery.parse({ filter: true })).toThrowError();
    expect(() => zQuery.parse({ filter: false })).toThrowError();
    expect(() => zQuery.parse({ filter: 1234 })).toThrowError();
  });

  test("parses orderBy correctly", () => {
    const data: IQuery = { orderBy: ["id", "asc"] };
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["id", "asc"]);
  });

  test("parses orderBy as string", () => {
    const data: IQuery = { orderBy: "name,asc" };
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("parses orderBy with descending order", () => {
    const data: IQuery = { orderBy: ["id", "desc"] };
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["id", "desc"]);
  });

  test("parses empty orderBy", () => {
    const data: IQuery = {};
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("parses orderBy as null", () => {
    const data: IQuery = { orderBy: null };
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("parses orderBy as undefined", () => {
    const data: IQuery = { orderBy: undefined };
    const parsed = zQuery.parse(data);
    expect(parsed.orderBy).toEqual(["name", "asc"]);
  });

  test("throws error if orderBy is not a tuple", () => {
    expect(() => zQuery.parse({ orderBy: {} })).toThrowError();
    expect(() => zQuery.parse({ orderBy: [] })).toThrowError();
    expect(() => zQuery.parse({ orderBy: "abc" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: "name,ASC" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: "name,DESC" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: "name, asc" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: "name, desc" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: ",asc" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: ",desc" })).toThrowError();
    expect(() => zQuery.parse({ orderBy: true })).toThrowError();
    expect(() => zQuery.parse({ orderBy: false })).toThrowError();
    expect(() => zQuery.parse({ orderBy: 1234 })).toThrowError();
  });

  test("throws error if orderBy configuration is incorrect", () => {
    expect(() => zQuery.parse({ orderBy: [123, "asc"] })).toThrowError();
    expect(() => zQuery.parse({ orderBy: ["name", "ASC"] })).toThrowError();
    expect(() => zQuery.parse({ orderBy: ["name", "DESC"] })).toThrowError();
    expect(() => zQuery.parse({ orderBy: [true, "asc"] })).toThrowError();
    expect(() => zQuery.parse({ orderBy: ["name"] })).toThrowError();
  });
});
