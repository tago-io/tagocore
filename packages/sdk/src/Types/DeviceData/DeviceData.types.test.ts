import {
  type IDeviceDataCreate,
  type IDeviceDataCreateLocation,
  type IDeviceDataLocationCoordinates,
  type IDeviceDataQuery,
  validateResourceID,
  zDeviceDataQuery,
} from "../index.ts";
import { type IDeviceData, zDeviceData, zDeviceDataCreate } from "./DeviceData.types.ts";
import { test, expect, describe } from "vitest";

describe("zDeviceData", () => {
  const data: IDeviceData = {
    created_at: new Date(),
    id: "6126af42599b57a4e91ec706",
    time: new Date(),
    variable: "temperature",
  };

  test("requires ID property", () => {
    const copy: IDeviceData = { ...data };
    (copy as any).id = undefined;
    const fn = () => zDeviceData.parse(copy);
    expect(fn).toThrow();
  });

  test("requires time property", () => {
    const copy: any = { ...data };
    copy.time = undefined;
    const fn = () => zDeviceData.parse(copy);
    expect(fn).toThrow();
  });

  test("requires variable property", () => {
    const copy: IDeviceData = { ...data };
    (copy as any).variable = undefined;
    const fn = () => zDeviceData.parse(copy);
    expect(fn).toThrow();
  });

  test("parses simple object", () => {
    const parsed = zDeviceData.parse(data);
    expect(parsed).toEqual(data);
  });
});

describe("zDeviceDataCreate", () => {
  test("parses object with only variable", () => {
    const data: IDeviceDataCreate = { variable: "temperature" };
    const parsed = zDeviceDataCreate.parse(data);
    expect(validateResourceID(parsed.id)).toEqual(true);
    expect(parsed.location).toBeUndefined();
    expect(parsed.metadata).toBeUndefined();
    expect(parsed.unit).toBeUndefined();
    expect(parsed.serie).toBeUndefined();
    expect(parsed.time).toBeInstanceOf(Date);
  });

  test("uses time from object if it was informed", () => {
    const data: IDeviceDataCreate = { time: new Date("2020-01-01T15:00:00Z"), variable: "temperature" };
    const parsed = zDeviceDataCreate.parse(data);
    expect(parsed.time).toEqual(new Date("2020-01-01T15:00:00Z"));
  });

  test("supports different time strings", () => {
    const fn = () => {
      zDeviceDataCreate.parse({ time: "2021", variable: "temperature" });
      zDeviceDataCreate.parse({ time: "2021/01", variable: "temperature" });
      zDeviceDataCreate.parse({ time: "2021/01/20", variable: "temperature" });
      zDeviceDataCreate.parse({ time: "2021T15:00:00Z", variable: "temperature" });
    };
    expect(fn).not.toThrow();
  });

  test("throws error if time is invalid", () => {
    const data: IDeviceDataCreate = { time: new Date("2020-01-01ABC15:00:00Z"), variable: "temperature" };
    const fn = () => zDeviceDataCreate.parse(data);
    expect(fn).toThrow();
  });

  test("parses location with lat && lng", () => {
    const location = { lat: 10, lng: 20 };
    const data: IDeviceDataCreate = { variable: "location", location };
    const parsed = zDeviceDataCreate.parse(data);
    expect(parsed.location).toEqual({ type: "Point", coordinates: [20, 10] });
  });

  test("parses location with coordinates", () => {
    const location: IDeviceDataCreateLocation = { type: "Point", coordinates: [20, 10] };
    const data: IDeviceDataCreate = { variable: "location", location };
    const parsed = zDeviceDataCreate.parse(data);
    expect(parsed.location).toEqual(location);
  });

  test("throws if object has invalid location", () => {
    const location: any = {};
    const data: IDeviceDataCreate = { variable: "location", location };
    const fn = () => zDeviceDataCreate.parse(data);
    expect(fn).toThrow();
  });

  test("throws if object has location.lat < -90", () => {
    const location: IDeviceDataCreateLocation = { lat: -300, lng: 10 };
    const data: IDeviceDataCreate = { variable: "location", location };
    const fn = () => zDeviceDataCreate.parse(data);
    expect(fn).toThrow();
  });

  test("throws if object has location.lat > 90", () => {
    const location: IDeviceDataCreateLocation = { lat: 90.1, lng: 10 };
    const data: IDeviceDataCreate = { variable: "location", location };
    const fn = () => zDeviceDataCreate.parse(data);
    expect(fn).toThrow();
  });

  test("autofills `type` in location object", () => {
    const location: IDeviceDataLocationCoordinates = { coordinates: [30, 45] };
    const data: IDeviceDataCreate = { variable: "location", location };
    const parsed = zDeviceDataCreate.parse(data);
    expect(parsed.location).toEqual({ type: "Point", coordinates: [30, 45] });
  });
});

describe("zDeviceDataQuery", () => {
  test("parses empty object", () => {
    const data: IDeviceDataQuery = {};
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).toEqual({
      query: "defaultQ",
      skip: 0,
      qty: 15,
      ordination: "desc",
    });
  });

  test("parses end_date as actual date", () => {
    const data: IDeviceDataQuery = { end_date: new Date() };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.end_date).toEqual(data.end_date);
  });

  test("parses end_date as null", () => {
    const data: IDeviceDataQuery = { end_date: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("end_date");
  });

  test("parses end_date as undefined", () => {
    const data: IDeviceDataQuery = { end_date: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("end_date");
  });

  test("parses end_date as valid strings and numbers", () => {
    const fn = () => {
      zDeviceDataQuery.parse({ end_date: 1639320965378 });
      zDeviceDataQuery.parse({ end_date: "2021" });
      zDeviceDataQuery.parse({ end_date: "2021/01" });
      zDeviceDataQuery.parse({ end_date: "2021/01/20" });
      zDeviceDataQuery.parse({ end_date: "2021T15:00:00Z" });
      zDeviceDataQuery.parse({ end_date: "2021-01-01T15:00:00Z" });
      zDeviceDataQuery.parse({ end_date: "2021-01-01" });
      zDeviceDataQuery.parse({ end_date: "1999-01-01T15:00" });
      zDeviceDataQuery.parse({ end_date: "1999-01-01T15:00:00.123Z" });
      zDeviceDataQuery.parse({ end_date: "1999-01-01T15:00:00.123456Z" });
    };
    expect(fn).not.toThrow();
  });

  test("throws error if end_date has invalid dates", () => {
    const fn = () => {
      zDeviceDataQuery.parse({ end_date: new Date("abc") });
      zDeviceDataQuery.parse({ end_date: true });
      zDeviceDataQuery.parse({ end_date: false });
      zDeviceDataQuery.parse({ end_date: {} });
      zDeviceDataQuery.parse({ end_date: [] });
    };
    expect(fn).toThrow();
  });

  test("parses start_date as actual date", () => {
    const data: IDeviceDataQuery = { start_date: new Date() };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.start_date).toEqual(data.start_date);
  });

  test("parses start_date as null", () => {
    const data: IDeviceDataQuery = { start_date: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("start_date");
  });

  test("parses start_date as undefined", () => {
    const data: IDeviceDataQuery = { start_date: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("start_date");
  });

  test("parses start_date as valid strings and numbers", () => {
    const fn = () => {
      zDeviceDataQuery.parse({ start_date: 1639320965378 });
      zDeviceDataQuery.parse({ start_date: "2021" });
      zDeviceDataQuery.parse({ start_date: "2021/01" });
      zDeviceDataQuery.parse({ start_date: "2021/01/20" });
      zDeviceDataQuery.parse({ start_date: "2021T15:00:00Z" });
      zDeviceDataQuery.parse({ start_date: "2021-01-01T15:00:00Z" });
      zDeviceDataQuery.parse({ start_date: "2021-01-01" });
      zDeviceDataQuery.parse({ start_date: "1999-01-01T15:00" });
      zDeviceDataQuery.parse({ start_date: "1999-01-01T15:00:00.123Z" });
      zDeviceDataQuery.parse({ start_date: "1999-01-01T15:00:00.123456Z" });
    };
    expect(fn).not.toThrow();
  });

  test("throws error if start_date has invalid dates", () => {
    expect(() => zDeviceDataQuery.parse({ start_date: new Date("abc") })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ start_date: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ start_date: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ start_date: {} })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ start_date: [] })).toThrowError();
  });

  test("parses ids as empty array", () => {
    const data: IDeviceDataQuery = { ids: [] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ids).toEqual([]);
  });

  test("parses ids as filled array", () => {
    const data: IDeviceDataQuery = { ids: ["61b2517991639c00197811e2", "11b2517991639c00197811e2"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ids).toEqual(["61b2517991639c00197811e2", "11b2517991639c00197811e2"]);
  });

  test("parses ids as null", () => {
    const data: IDeviceDataQuery = { ids: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("ids");
  });

  test("parses ids as undefined", () => {
    const data: IDeviceDataQuery = { ids: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("ids");
  });

  test("transfers string id property to ids", () => {
    const data = { id: "11b2517991639c00197811e2" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ids).toEqual(["11b2517991639c00197811e2"]);
    expect(parsed).not.toHaveProperty("id");
  });

  test("transfers array id property to ids", () => {
    const data = { id: ["11b2517991639c00197811e2"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ids).toEqual(["11b2517991639c00197811e2"]);
    expect(parsed).not.toHaveProperty("id");
  });

  test("prefers ids property over id property", () => {
    const data = { ids: ["61b251e291639c0019781ec2"], id: "11b2517991639c00197811e2" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ids).toEqual(["61b251e291639c0019781ec2"]);
    expect(parsed).not.toHaveProperty("id");
  });

  test("throws error if ids property is not a string array", () => {
    expect(() => zDeviceDataQuery.parse({ ids: 1 })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ids: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ids: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ids: {} })).toThrowError();
  });

  test("parses values as empty array", () => {
    const data: IDeviceDataQuery = { values: [] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual([]);
  });

  test("parses values as filled array", () => {
    const data: IDeviceDataQuery = { values: ["61b2517991639c00197811e2", "11b2517991639c00197811e2"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual(["61b2517991639c00197811e2", "11b2517991639c00197811e2"]);
  });

  test("parses values as null", () => {
    const data: IDeviceDataQuery = { values: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("values");
  });

  test("parses values as undefined", () => {
    const data: IDeviceDataQuery = { values: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("values");
  });

  test("parses values as boolean", () => {
    const data: IDeviceDataQuery = { values: [true] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual([true]);
  });

  test("parses values as number", () => {
    const data: IDeviceDataQuery = { values: [123] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual([123]);
  });

  test("transfers string value property to values", () => {
    const data = { value: "11b2517991639c00197811e2" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual(["11b2517991639c00197811e2"]);
    expect(parsed).not.toHaveProperty("value");
  });

  test("transfers array value property to values", () => {
    const data = { value: ["11b2517991639c00197811e2"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual(["11b2517991639c00197811e2"]);
    expect(parsed).not.toHaveProperty("value");
  });

  test("prefers values property over value property", () => {
    const data = { values: ["61b251e291639c0019781ec2"], value: "11b2517991639c00197811e2" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.values).toEqual(["61b251e291639c0019781ec2"]);
    expect(parsed).not.toHaveProperty("value");
  });

  test("throws error if values property is not a primitive type", () => {
    expect(() => zDeviceDataQuery.parse({ values: {} })).toThrowError();
  });

  test("parses groups as empty array", () => {
    const data: IDeviceDataQuery = { groups: [] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.groups).toEqual([]);
  });

  test("parses groups as filled array", () => {
    const data: IDeviceDataQuery = { groups: ["abc", "foo"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.groups).toEqual(["abc", "foo"]);
  });

  test("parses groups as null", () => {
    const data: IDeviceDataQuery = { groups: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("groups");
  });

  test("parses groups as undefined", () => {
    const data: IDeviceDataQuery = { groups: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("groups");
  });

  test("transfers string serie property to groups", () => {
    const data = { serie: "foo" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.groups).toEqual(["foo"]);
    expect(parsed).not.toHaveProperty("serie");
  });

  test("transfers array serie property to groups", () => {
    const data = { serie: ["foo"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.groups).toEqual(["foo"]);
    expect(parsed).not.toHaveProperty("serie");
  });

  test("prefers groups property over serie property", () => {
    const data = { groups: ["temp"], serie: "test" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.groups).toEqual(["temp"]);
    expect(parsed).not.toHaveProperty("serie");
  });

  test("throws error if groups property is not a string array", () => {
    expect(zDeviceDataQuery.safeParse({ groups: 1 }).success).toBeFalsy();
    expect(zDeviceDataQuery.safeParse({ groups: true }).success).toBeFalsy();
    expect(zDeviceDataQuery.safeParse({ groups: false }).success).toBeFalsy();
    expect(zDeviceDataQuery.safeParse({ groups: {} }).success).toBeFalsy();
  });

  test("parses variables as empty array", () => {
    const data: IDeviceDataQuery = { variables: [] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.variables).toEqual([]);
  });

  test("parses variables as filled array", () => {
    const data: IDeviceDataQuery = { variables: ["temperature", "humidity"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.variables).toEqual(["temperature", "humidity"]);
  });

  test("parses variables as null", () => {
    const data: IDeviceDataQuery = { variables: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("variables");
  });

  test("parses variables as undefined", () => {
    const data: IDeviceDataQuery = { variables: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed).not.toHaveProperty("variables");
  });

  test("transfers string variable property to variables", () => {
    const data = { variable: "weight" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.variables).toEqual(["weight"]);
    expect(parsed).not.toHaveProperty("variable");
  });

  test("transfers array variable property to variables", () => {
    const data = { variable: ["weight"] };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.variables).toEqual(["weight"]);
    expect(parsed).not.toHaveProperty("variable");
  });

  test("prefers variables property over variable property", () => {
    const data = { variables: ["height"], variable: "width" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.variables).toEqual(["height"]);
    expect(parsed).not.toHaveProperty("variable");
  });

  test("throws error if variables property is not a string array", () => {
    expect(() => zDeviceDataQuery.parse({ variables: 1 })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ variables: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ variables: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ variables: {} })).toThrowError();
  });

  test("parses skip", () => {
    const data: IDeviceDataQuery = { skip: 22 };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.skip).toEqual(22);
  });

  test("parses skip as string", () => {
    const data = { skip: "22" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.skip).toEqual(22);
  });

  test("parses skip as null", () => {
    const data: IDeviceDataQuery = { skip: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.skip).toEqual(0);
  });

  test("parses skip as undefined", () => {
    const data: IDeviceDataQuery = { skip: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.skip).toEqual(0);
  });

  test("throws error if skip is not a valid number", () => {
    expect(() => zDeviceDataQuery.parse({ skip: "hello" })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ skip: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ skip: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ skip: {} })).toThrowError();
  });

  test("parses qty", () => {
    const data: IDeviceDataQuery = { qty: 15 };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.qty).toEqual(15);
  });

  test("parses qty as string", () => {
    const data = { qty: "15" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.qty).toEqual(15);
  });

  test("parses qty as null", () => {
    const data: IDeviceDataQuery = { qty: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.qty).toEqual(15);
  });

  test("parses qty as undefined", () => {
    const data: IDeviceDataQuery = { qty: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.qty).toEqual(15);
  });

  test("throws error if qty is not a valid number", () => {
    expect(() => zDeviceDataQuery.parse({ qty: "hello" })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ qty: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ qty: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ qty: {} })).toThrowError();
  });

  test("parses ordination as asc", () => {
    const data: IDeviceDataQuery = { ordination: "asc" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("asc");
  });

  test("parses ordination as desc", () => {
    const data: IDeviceDataQuery = { ordination: "desc" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("desc");
  });

  test("parses ordination as ASC", () => {
    const data: IDeviceDataQuery = { ordination: "ASC" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("asc");
  });

  test("parses ordination as DESC", () => {
    const data: IDeviceDataQuery = { ordination: "DESC" };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("desc");
  });

  test("parses ordination as null", () => {
    const data: IDeviceDataQuery = { ordination: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("desc");
  });

  test("parses ordination as undefined", () => {
    const data: IDeviceDataQuery = { ordination: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.ordination).toEqual("desc");
  });

  test("throws error if ordination is not a valid value", () => {
    expect(() => zDeviceDataQuery.parse({ ordination: "hello" })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ordination: true })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ordination: false })).toThrowError();
    expect(() => zDeviceDataQuery.parse({ ordination: {} })).toThrowError();
  });

  test("parses details", () => {
    const data: IDeviceDataQuery = { details: true };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.details).toEqual(true);
  });

  test("parses details as null", () => {
    const data: IDeviceDataQuery = { details: null };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.details).toBeUndefined();
  });

  test("parses details as undefined", () => {
    const data: IDeviceDataQuery = { details: undefined };
    const parsed = zDeviceDataQuery.parse(data);
    expect(parsed.details).toBeUndefined();
  });
});
