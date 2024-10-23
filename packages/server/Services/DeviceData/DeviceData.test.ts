import { test, expect, vi, afterAll, beforeAll, afterEach, describe, Mock } from "vitest";
import { invokeDatabaseFunction } from "../../Plugins/invokeDatabaseFunction.ts";

vi.mock("../../Plugins/invokeDatabaseFunction.ts", () => ({
  invokeDatabaseFunction: vi.fn((method: string) => {
    switch (method) {
      case "getDeviceInfo":
        return activeDevice;
      default:
        return [];
    }
  })
}));

import {
  type IDevice,
  type IDeviceAddDataOptions,
  type IDeviceData,
  type IDeviceDataCreate,
  zDeviceDataQuery,
} from "@tago-io/tcore-sdk/types";
import { plugins } from "../../Plugins/Host.ts";
import Module from "../../Plugins/Module/Module.ts";
import * as Device from "../Device.ts";
import * as LiveInspector from "../LiveInspector.ts";
import * as PayloadParser from "../PayloadParserCodeExecution.ts";
import * as Statistic from "../Statistic.ts";
import * as DeviceData from "./DeviceData.ts";

beforeAll(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  plugins.clear();
});

afterAll(() => {
  vi.clearAllTimers();
});

const inactiveDevice: any = {
  id: "123",
  name: "Hello world",
};

const activeDevice: IDevice = {
  id: "123",
  active: true,
  created_at: new Date(),
  tags: [],
  name: "Hello world",
  inspected_at: new Date(),
  type: "immutable",
};

const mutableDevice: IDevice = {
  ...activeDevice,
  type: "mutable",
};

const immutableDevice: IDevice = {
  ...activeDevice,
  type: "immutable",
};

const dataCreate: IDeviceDataCreate = {
  variable: "temperature",
  value: 120,
  unit: "F",
  time: new Date(),
};

const mockData: IDeviceData = {
  id: "789",
  variable: "temperature",
  value: 120,
  unit: "F",
  time: new Date(),
  created_at: new Date(),
};

describe("addDeviceData", () => {
  test("resolves device", async () => {
    const mock = vi
      .spyOn(Device, "getDeviceInfo")
      .mockResolvedValue(inactiveDevice);
    await DeviceData.addDeviceData("123", []).catch(() => null);
    expect(mock).toHaveBeenCalled();
  });
});

describe("addDeviceDataByDevice", () => {
  test("rejects inactive devices", async () => {
    const error = vi.fn();
    await DeviceData.addDeviceDataByDevice(inactiveDevice, []).catch(error);
    expect(error).toHaveBeenCalledWith(
      new Error("Device not found or inactive"),
    );
  });

  test("rejects falsy devices", async () => {
    const error = vi.fn();
    await DeviceData.addDeviceDataByDevice(null as any, []).catch(error);
    expect(error).toHaveBeenCalledWith(
      new Error("Device not found or inactive"),
    );
  });

  // TODO - Fix this test
  // test("applies payload encoder", async () => {
  //   vi.spyOn(DeviceData, "applyPayloadEncoder").mockResolvedValue(123);
  //   const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
  //   await expect(fn).rejects.toThrow("invalid_type");
  // });

  test("applies payload parser", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue("abc");
    const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
    await expect(fn).rejects.toThrow("invalid_type");
  });

  test("payload parser cannot return a string", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue("hello");
    const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
    await expect(fn).rejects.toThrow("Expected object, received string");
  });

  test("payload parser cannot return a number", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue(123);
    const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
    await expect(fn).rejects.toThrow("Expected object, received number");
  });

  test("payload parser cannot return a non-data object", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue({});
    const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
    await expect(fn).rejects.toThrow("variable");
  });

  test("payload parser cannot return a random array", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue([1, 2, 3]);
    const fn = () => DeviceData.addDeviceDataByDevice(activeDevice, []);
    await expect(fn).rejects.toThrow("Expected object, received number");
  });

  test("payload parser can return a data object", async () => {
    vi.spyOn(PayloadParser, "runPayloadParser").mockResolvedValue(dataCreate);
    const result = await DeviceData.addDeviceDataByDevice(activeDevice, []);
    expect(result).toEqual("1 items added");
  });

  test("payload parser can return a data array", async () => {
    vi
      .spyOn(PayloadParser, "runPayloadParser")
      .mockResolvedValue([dataCreate, dataCreate]);
    const result = await DeviceData.addDeviceDataByDevice(activeDevice, []);
    expect(result).toEqual("2 items added");
  });

  test("calls invokeDatabaseFunction", async () => {
    const data = { ...dataCreate, time: null };
    await DeviceData.addDeviceDataByDevice(activeDevice, data);

    const arg1 = invokeDatabaseFunction.mock.calls[0][0]; // method
    const arg2 = (invokeDatabaseFunction as any).mock.calls[0][1]; // device id
    const arg3 = (invokeDatabaseFunction as any).mock.calls[0][3]; // data
    expect(arg1).toEqual("addDeviceData");
    expect(arg2).toEqual(activeDevice.id);
    expect(arg3).toHaveLength(1);
    expect(arg3[0].id).toBeTruthy();
    expect(arg3[0].created_at).toBeTruthy();
    expect(arg3[0].type).toEqual("number");
    expect(arg3[0].time).toBeInstanceOf(Date);
  });

  // TODO - Fix this test
  // test("applies payload encoder, then parser, then inserts data", async () => {
  //   const m1 = vi
  //     .spyOn(DeviceData, "applyPayloadEncoder")
  //     .mockResolvedValue(123);
  //   const m2 = vi
  //     .spyOn(PayloadParser, "runPayloadParser")
  //     .mockResolvedValue([]);
  //   await DeviceData.addDeviceDataByDevice(activeDevice, dataCreate);

  //   expect(m1.mock.calls[0][0]).toEqual(activeDevice);
  //   expect(m1.mock.calls[0][1]).toEqual(dataCreate);
  //   expect(m1.mock.calls[0][2]).toBeTruthy();

  //   expect(m2.mock.calls[0][0]).toEqual(activeDevice);
  //   expect(m2.mock.calls[0][1]).toEqual(123);
  //   expect(m2.mock.calls[0][2]).toBeTruthy();

  //   const data = (invokeDatabaseFunction as any).mock.calls[0][3];
  //   expect(data).toEqual([]);
  // });

  // TODO - Fix this test
  // test("triggers actions after inserting data", async () => {
  //   const mock = vi.spyOn(DeviceData, "triggerActions");
  //   await DeviceData.addDeviceDataByDevice(activeDevice, dataCreate);
  //   expect(mock).toHaveBeenCalled();
  // });

  test("adds statistics", async () => {
    const mock = vi.spyOn(Statistic, "addStatistic");
    await DeviceData.addDeviceDataByDevice(activeDevice, [
      dataCreate,
      dataCreate,
    ]);
    expect(mock).toHaveBeenCalledWith({ input: 2, output: 0 });
  });

  test("updates device last_input", async () => {
    const mock = vi.spyOn(Device, "editDevice");
    await DeviceData.addDeviceDataByDevice(activeDevice, dataCreate);

    const arg1 = mock.mock.calls[0][0];
    const arg2 = mock.mock.calls[0][1];
    expect(arg1).toEqual(activeDevice.id);
    expect(arg2.last_input).toBeInstanceOf(Date);
  });

  // TODO - Fix this test
  // test("throws if mutable device has too much data", async () => {
  //   vi.spyOn(DeviceData, "getDeviceDataAmount").mockResolvedValue(50000);
  //   const fn = () =>
  //     DeviceData.addDeviceDataByDevice(mutableDevice, dataCreate);
  //   await expect(fn).rejects.toThrow("has reached the limit");
  // });

  // TODO - Fix this test
  // test("doesn't throws if mutable device doesn't have too much data", async () => {
  //   vi.spyOn(DeviceData, "getDeviceDataAmount").mockResolvedValue(1000);
  //   const result = await DeviceData.addDeviceDataByDevice(
  //     mutableDevice,
  //     dataCreate,
  //   );
  //   expect(result).toEqual("1 items added");
  // });

  test("doesn't throw if immutable device has too much data", async () => {
    vi.spyOn(DeviceData, "getDeviceDataAmount").mockResolvedValue(50000);
    const result = await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      dataCreate,
    );
    expect(result).toEqual("1 items added");
  });

  test("doesn't generate liveInspectorID if options has it", async () => {
    const options: IDeviceAddDataOptions = { liveInspectorID: "123" };
    await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      dataCreate,
      options,
    );
    expect(options.liveInspectorID).toEqual("123");
  });

  test("generates liveInspectorID if options doesn't have it", async () => {
    const options: IDeviceAddDataOptions = {};
    await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      dataCreate,
      options,
    );
    expect(options.liveInspectorID).toHaveLength(10);
  });

  test("sets rawPayload on options as object", async () => {
    const options: IDeviceAddDataOptions = {};
    await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      dataCreate,
      options,
    );
    expect(options.rawPayload).toEqual([dataCreate]);
  });

  test("sets rawPayload on options as array", async () => {
    const options: IDeviceAddDataOptions = {};
    await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      [dataCreate],
      options,
    );
    expect(options.rawPayload).toEqual([dataCreate]);
  });

  test("sets rawPayload on options as anything", async () => {
    const options: IDeviceAddDataOptions = {};
    const data = "hello-world";
    await DeviceData.addDeviceDataByDevice(
      immutableDevice,
      data,
      options,
    ).catch(() => null);
    expect(options.rawPayload).toEqual(data);
  });

  test("calls emitToLiveInspector with the raw payload", async () => {
    const mock = vi.spyOn(LiveInspector, "emitToLiveInspector");
    await DeviceData.addDeviceDataByDevice(immutableDevice, dataCreate);
    const arg1 = mock.mock.calls[0][0]; // device
    const arg2 = mock.mock.calls[0][1]; // inspector data
    const arg3 = mock.mock.calls[0][2]; // live inspector id
    expect(arg1).toEqual(immutableDevice);
    expect(arg2).toEqual({ title: "Raw Payload", content: dataCreate });
    expect(arg3).toBeTruthy();
  });
});

describe("group generation", () => {
  test("generates a group", async () => {
    await DeviceData.addDeviceDataByDevice(activeDevice, dataCreate);
    const argData = (invokeDatabaseFunction as any).mock.calls[0][3];
    expect(argData).toHaveLength(1);
    expect(argData[0].group).toHaveLength(24);
  });

  test("generates a single group for multiple items", async () => {
    const data = [dataCreate, dataCreate, dataCreate];
    await DeviceData.addDeviceDataByDevice(activeDevice, data);
    const argData = (invokeDatabaseFunction as any).mock.calls[0][3];
    expect(argData).toHaveLength(3);
    expect(argData[0].group).toHaveLength(24);
    expect(argData[1].group).toHaveLength(24);
    expect(argData[2].group).toHaveLength(24);
    expect(argData[1].group).toEqual(argData[0].group);
    expect(argData[2].group).toEqual(argData[0].group);
  });

  test("doesn't generate new group for items with a group", async () => {
    const data = [dataCreate, { ...dataCreate, group: "abc" }];
    await DeviceData.addDeviceDataByDevice(activeDevice, data);
    const argData = (invokeDatabaseFunction as any).mock.calls[0][3];
    expect(argData).toHaveLength(2);
    expect(argData[0].group).toHaveLength(24);
    expect(argData[1].group).toEqual("abc");
  });

  test("respects serie property", async () => {
    const data = [dataCreate, { ...dataCreate, serie: "abc" }];
    await DeviceData.addDeviceDataByDevice(activeDevice, data);
    const argData = (invokeDatabaseFunction as any).mock.calls[0][3];
    expect(argData).toHaveLength(2);
    expect(argData[0].group).toHaveLength(24);
    expect(argData[1].group).toEqual("abc");
  });

  test("respects serie, group, and auto-generation", async () => {
    const data = [
      { ...dataCreate, serie: "456" },
      { ...dataCreate, serie: "abc" },
      { ...dataCreate, group: undefined },
    ];
    await DeviceData.addDeviceDataByDevice(activeDevice, data);
    const argData = (invokeDatabaseFunction as any).mock.calls[0][3];
    expect(argData).toHaveLength(3);
    expect(argData[0].group).toEqual("456");
    expect(argData[1].group).toEqual("abc");
    expect(argData[2].group).toHaveLength(24);
  });
});

describe("deleteDeviceData", () => {
  test("cannot delete data from immutable devices", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(immutableDevice);
    const fn = () => DeviceData.deleteDeviceData(immutableDevice.id);
    await expect(fn).rejects.toThrow(
      "Data in immutable devices cannot be deleted",
    );
  });

  test("can delete data from mutable devices", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
    vi.spyOn(DeviceData, "getDeviceData").mockResolvedValue([]);
    await DeviceData.deleteDeviceData(mutableDevice.id);
    expect(invokeDatabaseFunction).toHaveBeenCalled();
  });

  test("passes array of ids to database deleteDeviceData", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
    vi
      .spyOn(DeviceData, "getDeviceData")
      .mockResolvedValue([mockData, mockData]);
    await DeviceData.deleteDeviceData(mutableDevice.id);

    const arg1 = (invokeDatabaseFunction as Mock).mock.calls[2][0]; // method
    const arg2 = (invokeDatabaseFunction as Mock).mock.calls[0][1]; // device id
    const arg3 = (invokeDatabaseFunction as Mock).mock.calls[2][1]; // ids
    const arg4 = (invokeDatabaseFunction as Mock).mock.calls[2][2]; // ids
    expect(arg1).toEqual("deleteDeviceData");
    expect(arg2).toEqual(mutableDevice.id);
    expect(arg3).toEqual(mutableDevice.id);
    expect(arg4).toEqual(mutableDevice.id);
  });

  // TODO - Fix this test
  // test("returns the amount of deleted items", async () => {
  //   const deviceData = [mockData, mockData, mockData, mockData];
  //   vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
  //   vi.spyOn(DeviceData, "getDeviceData").mockResolvedValue(deviceData);
  //   const result = await DeviceData.deleteDeviceData(mutableDevice.id);
  //   expect(result).toEqual(deviceData.length);
  // });

  // TODO - Fix this test
  // test("throws if getDeviceData result is not an array", async () => {
  //   vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
  //   vi.spyOn(DeviceData, "getDeviceData").mockResolvedValue(123);
  //   const fn = () => DeviceData.deleteDeviceData(mutableDevice.id);
  //   await expect(fn).rejects.toThrow("Invalid query");
  // });
});

describe("getDeviceDataAmount", () => {
  test("validates the device id", async () => {
    const spy = vi
      .spyOn(Device, "getDeviceInfo")
      .mockResolvedValue(activeDevice);
    await DeviceData.getDeviceDataAmount(mutableDevice.id).catch(() => null);
    expect(spy).toHaveBeenCalled();
  });

  test("database getDeviceDataAmount cannot return a string", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce("123");
    const fn = () => DeviceData.getDeviceDataAmount(mutableDevice.id);
    await expect(fn).rejects.toThrow("Expected number, received string");
  });

  test("database getDeviceDataAmount cannot return an array", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([]);
    const fn = () => DeviceData.getDeviceDataAmount(mutableDevice.id);
    await expect(fn).rejects.toThrow("Expected number, received array");
  });

  test("database getDeviceDataAmount cannot return an object", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce({});
    const fn = () => DeviceData.getDeviceDataAmount(mutableDevice.id);
    await expect(fn).rejects.toThrow("Expected number, received object");
  });

  test("database getDeviceDataAmount cannot return false", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce(false);
    const fn = () => DeviceData.getDeviceDataAmount(mutableDevice.id);
    await expect(fn).rejects.toThrow("Expected number, received boolean");
  });

  test("database getDeviceDataAmount cannot return true", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce(true);
    const fn = () => DeviceData.getDeviceDataAmount(mutableDevice.id);
    await expect(fn).rejects.toThrow("Expected number, received boolean");
  });

  test("database getDeviceDataAmount must return a number", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce(1000);
    const result = await DeviceData.getDeviceDataAmount(mutableDevice.id);
    expect(result).toEqual(1000);
  });
});

describe("applyPayloadEncoder", () => {
  test("returns original data if there are no encoders", async () => {
    const result = await DeviceData.applyPayloadEncoder(mutableDevice, "123");
    expect(result).toEqual("123");
  });

  test("emits to live inspector if encoder plugin is not found", async () => {
    const mock = vi.spyOn(LiveInspector, "emitToLiveInspector");
    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    const result = await DeviceData.applyPayloadEncoder(device, "123");
    expect(result).toEqual("123");
    expect(mock.mock.calls[0][1]).toEqual({
      title: "Encoder plugin not found",
      content: "plugin1",
    });
  });

  test("emits to live inspector if encoder module is not found", async () => {
    plugins.set("plugin1", { modules: new Map() } as any);
    const mock = vi.spyOn(LiveInspector, "emitToLiveInspector");
    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    const result = await DeviceData.applyPayloadEncoder(device, "123");
    expect(result).toEqual("123");
    expect(mock.mock.calls[0][1]).toEqual({
      title: "Encoder module not found",
      content: "module1",
    });
  });

  test("invokes onCall on the module", async () => {
    const plugin: any = { modules: new Map() };
    plugin.modules.set("module1", new Module(plugin, {} as any));
    plugin.modules.get("module1").invokeOnCall = vi
      .fn()
      .mockResolvedValue(444);
    plugins.set("plugin1", plugin);

    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    const result = await DeviceData.applyPayloadEncoder(device, "123");

    expect(plugin.modules.get("module1").invokeOnCall).toHaveBeenCalledWith(
      "123",
    );
    expect(result).toEqual(444);
  });

  test("ignores encoder if onCall throws an error", async () => {
    const plugin: any = { modules: new Map() };
    plugin.modules.set("module1", new Module(plugin, {} as any));
    plugin.modules.get("module1").invokeOnCall = vi
      .fn()
      .mockRejectedValue(null);
    plugins.set("plugin1", plugin);

    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    const result = await DeviceData.applyPayloadEncoder(device, "123");

    expect(plugin.modules.get("module1").invokeOnCall).toHaveBeenCalledWith(
      "123",
    );
    expect(result).toEqual("123");
  });

  test("emits to live inspector after module.onCall", async () => {
    const plugin: any = { modules: new Map() };
    plugin.modules.set(
      "module1",
      new Module(plugin, { id: "1", name: "Temp" } as any),
    );
    plugin.modules.get("module1").invokeOnCall = vi
      .fn()
      .mockResolvedValue(1000);
    plugins.set("plugin1", plugin);

    const mock = vi.spyOn(LiveInspector, "emitToLiveInspector");
    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    await DeviceData.applyPayloadEncoder(device, "123");

    expect(mock.mock.calls[0][1]).toEqual({
      title: "Applied encoder Temp",
      content: 1000,
    });
  });

  test("emits to live inspector using liveInspectorID", async () => {
    const options = { liveInspectorID: "684613516843586" };

    const plugin: any = { modules: new Map() };
    plugin.modules.set(
      "module1",
      new Module(plugin, { id: "1", name: "Temp" } as any),
    );
    plugin.modules.get("module1").invokeOnCall = vi
      .fn()
      .mockResolvedValue(null);
    plugins.set("plugin1", plugin);

    const mock = vi.spyOn(LiveInspector, "emitToLiveInspector");
    const device = { ...mutableDevice, encoder_stack: ["plugin1:module1"] };
    await DeviceData.applyPayloadEncoder(device, "123", options);

    expect(mock.mock.calls[0][1]).toEqual({
      title: "Applied encoder Temp",
      content: "null",
    });
    expect(mock.mock.calls[0][2]).toEqual(options.liveInspectorID);
  });
});

describe("editDeviceData", () => {
  test("calls invokeDatabaseFunction", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
    await DeviceData.editDeviceData("123", [mockData]);
    expect(invokeDatabaseFunction).toHaveBeenCalled();
  });

  test("deletes time and created_at", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
    await DeviceData.editDeviceData("123", [mockData]);
    const arg3 = (invokeDatabaseFunction as Mock).mock.calls[0][2][0];
    expect(arg3.time).toBeUndefined();
    expect(arg3.created_at).toBeUndefined();
  });

  test("keeps data id", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(mutableDevice);
    await DeviceData.editDeviceData("123", [mockData]);
    const arg3 = (invokeDatabaseFunction as Mock).mock.calls[0][3][0];
    expect(arg3.id).toEqual(mockData.id);
  });
});

describe("emptyDevice", () => {
  test("calls invokeDatabaseFunction", async () => {
    await DeviceData.emptyDevice("123");
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "emptyDevice",
      "123",
      "immutable",
    );
  });
});

describe("getDeviceData", () => {
  test("throws on invalid query type", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "invalid_query" };
    const fn = () => DeviceData.getDeviceData("123", query);
    await expect(fn).rejects.toThrow("Invalid enum value");
  });

  test("calls getDeviceDataCount on count", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "count" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataCount",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataCount on count", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce(456);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "count" };
    const result = await DeviceData.getDeviceData("123", query);
    expect(result).toEqual(456);
  });

  test("calls getDeviceDataAvg on avg", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { start_date: new Date(), query: "avg" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataAvg",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataAvg on avg", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce(1000);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { start_date: new Date(), query: "avg" };
    const result = await DeviceData.getDeviceData("123", query);
    expect(result).toEqual(1000);
  });

  test("calls getDeviceDataSum on sum", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { start_date: new Date(), query: "sum" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataSum",
      "123",
      "immutable",
      parsed,
    );
  });

  test("calls getDeviceDataDefaultQ without a query", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const parsed = zDeviceDataQuery.parse({});
    await DeviceData.getDeviceData("123");
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataDefaultQ",
      "123",
      "immutable",
      parsed,
    );
  });

  test("calls getDeviceDataDefaultQ on defaultQ", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "defaultQ" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataDefaultQ",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataDefaultQ", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataLastValue on last_value", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "last_value" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataLastValue",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataLastValue", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataLastLocation on last_location", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "last_location" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataLastLocation",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataLastLocation", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataLastItem on last_item", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "last_item" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataLastItem",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataLastItem", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataLastInsert on last_insert", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "last_insert" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataLastInsert",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataLastInsert", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataFirstValue on first_value", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "first_value" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataFirstValue",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataFirstValue", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataFirstLocation on first_location", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "first_location" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataFirstLocation",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataFirstLocation", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataFirstItem on first_item", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "first_item" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataFirstItem",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataFirstItem", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataFirstInsert on first_insert", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { query: "first_insert" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataFirstInsert",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataFirstInsert", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataMin on min", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { start_date: new Date(), query: "min" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataMin",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataMin", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("calls getDeviceDataMax on max", async () => {
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const query: any = { start_date: new Date(), query: "max" };
    const parsed = zDeviceDataQuery.parse(query);
    await DeviceData.getDeviceData("123", query);
    expect(invokeDatabaseFunction).toHaveBeenCalledWith(
      "getDeviceDataMax",
      "123",
      "immutable",
      parsed,
    );
  });

  test("returns the value of getDeviceDataMax", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
  });

  test("adds device to return on array queries", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([
      { ...mockData, serie: "123" },
    ]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123");
    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(mockData.id);
    expect(result[0].device).toEqual("123");
    expect(result[0].created_at).toBeUndefined();
    expect(result[0].group).toEqual("123");
  });

  test("only adds created_at if details is set", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const result = await DeviceData.getDeviceData("123", { details: true });
    expect(result).toHaveLength(1);
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  test("adds statistics", async () => {
    (invokeDatabaseFunction as Mock).mockResolvedValueOnce([{ ...mockData }]);
    vi.spyOn(Device, "getDeviceInfo").mockResolvedValue(activeDevice);
    const mock = vi.spyOn(Statistic, "addStatistic");
    await DeviceData.getDeviceData("123");
    expect(mock).toHaveBeenCalledWith({ input: 0, output: 1 });
  });
});
