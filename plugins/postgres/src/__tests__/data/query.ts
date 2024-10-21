import type {
  IDeviceCreate,
  IDeviceData,
  IDeviceDataCreate,
} from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { DateTime } from "luxon";

let deviceID: string | undefined;
let token: string;

beforeAll(async () => {
  const data: IDeviceCreate = {
    name: "test",
    data_retention: "forever",
    type: "immutable",
  };

  const res = await axios.post("/device", data);

  deviceID = res.data.result.device_id;
  token = res.data.result.token;

  if (!token) {
    throw "Missing token";
  }

  const deviceData: IDeviceDataCreate[] = [];
  for (let i = 1; i <= 10; i++) {
    deviceData.push({ variable: "temp", value: i, unit: "C" });
  }

  await axios.post("/data", deviceData, { headers: { token } });
});

afterAll(async () => {
  if (!deviceID) {
    return;
  }

  await axios.delete(`/device/${deviceID}`).catch(console.error);
  deviceID = undefined;
  token = "";
});

describe("Query device data", () => {
  test("default", async () => {
    const res = await axios.get("/data", { headers: { token } });

    const list: IDeviceData[] = res?.data?.result;
    expect(list?.length).toBe(10);
    for (const data of list) {
      expect(data).toMatchObject({
        id: expect.any(String),
        device: deviceID,
        group: expect.any(String),
        time: expect.any(String),
        unit: "C",
        value: expect.any(Number),
        variable: "temp",
      });
    }
  });

  test("max", async () => {
    const start_date = DateTime.utc().minus({ day: 1 }).toJSDate();
    const res = await axios.get("/data", {
      params: {
        query: "max",
        start_date,
      },
      headers: { token },
    });

    const list: IDeviceData[] = res?.data?.result;
    expect(list?.length).toBe(1);
    const data = list[0];

    expect(data).toMatchObject({
      id: expect.any(String),
      device: deviceID,
      group: expect.any(String),
      time: expect.any(String),
      unit: "C",
      value: 9,
      variable: "temp",
    });
  });

  test("min", async () => {
    const start_date = DateTime.utc().minus({ day: 1 }).toJSDate();
    const res = await axios.get("/data", {
      params: {
        query: "min",
        start_date,
      },
      headers: { token },
    });

    const list: IDeviceData[] = res?.data?.result;
    expect(list?.length).toBe(1);
    const data = list[0];

    expect(data).toMatchObject({
      id: expect.any(String),
      device: deviceID,
      group: expect.any(String),
      time: expect.any(String),
      unit: "C",
      value: 1,
      variable: "temp",
    });
  });

  test("Sum", async () => {
    const start_date = DateTime.utc().minus({ day: 1 }).toJSDate();
    const res = await axios.get("/data", {
      params: {
        query: "sum",
        start_date,
      },
      headers: { token },
    });

    const sum: IDeviceData[] = res?.data?.result;

    expect(sum).toBe(55);
  });

  test("Count", async () => {
    const start_date = DateTime.utc().minus({ day: 1 }).toJSDate();
    const res = await axios.get("/data", {
      params: {
        query: "count",
        start_date,
      },
      headers: { token },
    });

    const count: IDeviceData[] = res?.data?.result;

    expect(count).toBe(10);
  });
});
