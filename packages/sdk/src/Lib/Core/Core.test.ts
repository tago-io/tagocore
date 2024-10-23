import core from "./Core.ts";
import { test, expect, vi, afterEach } from "vitest";

afterEach(() => {
  vi.clearAllMocks();
});

test("getDeviceList works without query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getDeviceList();
  expect(fn).toHaveBeenCalledWith("getDeviceList", undefined);
  expect(response).toEqual([]);
});

test("getDeviceList works with query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getDeviceList({});
  expect(fn).toHaveBeenCalledWith("getDeviceList", {});
  expect(response).toEqual([]);
});

test("getDeviceInfo", async () => {
  const mockDevice = { name: "Device #1" };
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(mockDevice);
  const response = await core.getDeviceInfo("6126ff702e576dd238e1da3e");
  expect(fn).toHaveBeenCalledWith("getDeviceInfo", "6126ff702e576dd238e1da3e");
  expect(response).toEqual(mockDevice);
});

test("getDeviceByToken", async () => {
  const mockDevice = { name: "Device #2" };
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(mockDevice);
  const response = await core.getDeviceByToken("b24afe36-33ff-4f48-9bbd-b10d446d779d");
  expect(fn).toHaveBeenCalledWith("getDeviceByToken", "b24afe36-33ff-4f48-9bbd-b10d446d779d");
  expect(response).toEqual(mockDevice);
});

test("editDevice", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  await core.editDevice("6126ff702e576dd238e1da3e", { active: false });
  expect(fn).toHaveBeenCalledWith("editDevice", "6126ff702e576dd238e1da3e", { active: false });
});

test("deleteDevice", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  const response = await core.deleteDevice("6126ff702e576dd238e1da3e");
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("deleteDevice", "6126ff702e576dd238e1da3e");
});

test("createDevice", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue({ device_id: 1, token: 3 });
  const response = await core.createDevice({ name: "My new device" });
  expect(response.device_id).toEqual(1);
  expect(response.token).toEqual(3);
  expect(fn).toHaveBeenCalledWith("createDevice", { name: "My new device" });
});

test("createDeviceToken", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue({ token: "123" });
  const response = await core.createDeviceToken("6126ff702e576dd238e1da3e", {
    name: "Token #1",
    permission: "full",
    expire_time: "1 day",
  });
  expect(response).toEqual({ token: "123" });
  expect(fn).toHaveBeenCalledWith("createDeviceToken", "6126ff702e576dd238e1da3e", {
    name: "Token #1",
    permission: "full",
    expire_time: "1 day",
  });
});

test("getDeviceTokenList works without query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([1, 2, 3]);
  const response = await core.getDeviceTokenList("6126ff702e576dd238e1da3e");
  expect(response).toEqual([1, 2, 3]);
  expect(fn).toHaveBeenCalledWith("getDeviceTokenList", "6126ff702e576dd238e1da3e", undefined);
});

test("getDeviceTokenList works with query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([1, 2]);
  const response = await core.getDeviceTokenList("6126ff702e576dd238e1da3e", {});
  expect(response).toEqual([1, 2]);
  expect(fn).toHaveBeenCalledWith("getDeviceTokenList", "6126ff702e576dd238e1da3e", {});
});

test("deleteDeviceToken", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([1, 2]);
  const response = await core.deleteDeviceToken("6126ff702e576dd238e1da3e");
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("deleteDeviceToken", "6126ff702e576dd238e1da3e");
});

test("getDeviceParamList works without sentStatus", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([{ key: "key", value: "value" }]);
  const response = await core.getDeviceParamList("6126ff702e576dd238e1da3e");
  expect(response).toEqual([{ key: "key", value: "value" }]);
  expect(fn).toHaveBeenCalledWith("getDeviceParamList", "6126ff702e576dd238e1da3e", undefined);
});

test("getDeviceParamList works with sentStatus", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([{ key: "key", value: "value" }]);
  const response = await core.getDeviceParamList("6126ff702e576dd238e1da3e", true);
  expect(response).toEqual([{ key: "key", value: "value" }]);
  expect(fn).toHaveBeenCalledWith("getDeviceParamList", "6126ff702e576dd238e1da3e", true);
});

test("deleteDeviceParam", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue("abc");
  const response = await core.deleteDeviceParam("6126ff702e576dd238e1da3e");
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("deleteDeviceParam", "6126ff702e576dd238e1da3e");
});

test("setDeviceParams", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue("abc");
  const response = await core.setDeviceParams("6126ff702e576dd238e1da3e", []);
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("setDeviceParams", "6126ff702e576dd238e1da3e", []);
});

test("getDeviceDataAmount", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(1337);
  const response = await core.getDeviceDataAmount("61261ef1f87480ff318b7bcb");
  expect(response).toEqual(1337);
  expect(fn).toHaveBeenCalledWith("getDeviceDataAmount", "61261ef1f87480ff318b7bcb");
});

test("getActiontypes.ts", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getActionTypes();
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("getActiontypes.ts");
});

test("getActionList works without query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([{ name: "Action #1" }]);
  const response = await core.getActionList();
  expect(response).toEqual([{ name: "Action #1" }]);
  expect(fn).toHaveBeenCalledWith("getActionList", undefined);
});

test("getActionList works with query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getActionList({});
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("getActionList", {});
});

test("getActionInfo", async () => {
  const mockAction = { name: "Action #1" };
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(mockAction);
  const response = await core.getActionInfo("6126ff702e576dd238e1da3e");
  expect(fn).toHaveBeenCalledWith("getActionInfo", "6126ff702e576dd238e1da3e");
  expect(response).toEqual(mockAction);
});

test("editAction", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  await core.editAction("6126ff702e576dd238e1da3e", { name: "New name" });
  expect(fn).toHaveBeenCalledWith("editAction", "6126ff702e576dd238e1da3e", { name: "New name" });
});

test("deleteAction", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  const response = await core.deleteAction("6126ff702e576dd238e1da3e");
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("deleteAction", "6126ff702e576dd238e1da3e");
});

test("createAction", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue("61261ef1f87480ff318b7bcb");
  const response = await core.createAction({ name: "My new Action", active: false, type: "" } as any);
  expect(response).toEqual("61261ef1f87480ff318b7bcb");
  expect(fn).toHaveBeenCalledWith("createAction", { name: "My new Action", active: false, type: "" });
});

test("triggerAction works without data", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.triggerAction("6126ff702e576dd238e1da3e");
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("triggerAction", "6126ff702e576dd238e1da3e", undefined);
});

test("triggerAction works with data", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.triggerAction("6126ff702e576dd238e1da3e", {});
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("triggerAction", "6126ff702e576dd238e1da3e", {});
});

test("getAnalysisList works without query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([{ name: "Analysis #1" }]);
  const response = await core.getAnalysisList();
  expect(response).toEqual([{ name: "Analysis #1" }]);
  expect(fn).toHaveBeenCalledWith("getAnalysisList", undefined);
});

test("getAnalysisList works with query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getAnalysisList({});
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("getAnalysisList", {});
});

test("getAnalysisInfo", async () => {
  const mockAnalysis = { name: "Analysis #1" };
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(mockAnalysis);
  const response = await core.getAnalysisInfo("6126ff702e576dd238e1da3e");
  expect(fn).toHaveBeenCalledWith("getAnalysisInfo", "6126ff702e576dd238e1da3e");
  expect(response).toEqual(mockAnalysis);
});

test("editAnalysis", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  await core.editAnalysis("6126ff702e576dd238e1da3e", { name: "New name" });
  expect(fn).toHaveBeenCalledWith("editAnalysis", "6126ff702e576dd238e1da3e", { name: "New name" });
});

test("deleteAnalysis", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod");
  const response = await core.deleteAnalysis("6126ff702e576dd238e1da3e");
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith("deleteAnalysis", "6126ff702e576dd238e1da3e");
});

test("createAnalysis", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue("61261ef1f87480ff318b7bcb");
  const response = await core.createAnalysis({ name: "My new Analysis", active: false, tags: [] });
  expect(response).toEqual("61261ef1f87480ff318b7bcb");
  expect(fn).toHaveBeenCalledWith("createAnalysis", { name: "My new Analysis", active: false, tags: [] });
});

test("getSummary", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue({ device: 20 });
  const response = await core.getSummary();
  expect(response).toEqual({ device: 20 });
  expect(fn).toHaveBeenCalledWith("getSummary");
});

test("addDeviceData", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue(true);
  const response = await core.addDeviceData("61261ef1f87480ff318b7bcb", {
    variable: "temperature",
    value: 10,
  });
  expect(response).toEqual(undefined);
  expect(fn).toHaveBeenCalledWith(
    "addDeviceData",
    "61261ef1f87480ff318b7bcb",
    {
      variable: "temperature",
      value: 10,
    },
    undefined
  );
});

test("getDeviceData works without query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await core.getDeviceData("61261ef1f87480ff318b7bcb");
  expect(response).toEqual([]);
  expect(fn).toHaveBeenCalledWith("getDeviceData", "61261ef1f87480ff318b7bcb", undefined);
});

test("getDeviceData works with query", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([{ variable: "temperature", value: 10 }]);
  const response = await core.getDeviceData("61261ef1f87480ff318b7bcb", {});
  expect(response).toEqual([{ variable: "temperature", value: 10 }]);
  expect(fn).toHaveBeenCalledWith("getDeviceData", "61261ef1f87480ff318b7bcb", {});
});

test("getTagKeys works for all types of resources", async () => {
  const fn = vi.spyOn(core as any, "invokeApiMethod").mockResolvedValue([]);
  const response = await Promise.all([
    core.getTagKeys("action"),
    core.getTagKeys("analysis"),
    core.getTagKeys("device"),
  ]);
  expect(response).toEqual([[], [], []]);
  expect(fn).toHaveBeenNthCalledWith(1, "getTagKeys", "action");
  expect(fn).toHaveBeenNthCalledWith(2, "getTagKeys", "analysis");
  expect(fn).toHaveBeenNthCalledWith(3, "getTagKeys", "device");
});
