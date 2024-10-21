import type { IDeviceCreate } from "@tago-io/tcore-sdk/types";
import axios from "axios";

let deviceID: string | undefined;

afterEach(async () => {
  if (!deviceID) {
    return;
  }

  await axios.delete(`/device/${deviceID}`).catch();

  deviceID = undefined;
});

describe("Create device", () => {
  it("should create immutable device", async () => {
    const data: IDeviceCreate = {
      name: "test",
      data_retention: "forever",
      type: "immutable",
    };

    const res = await axios.post("/device", data);

    expect(res?.data).toMatchObject({
      status: true,
      result: {
        device_id: expect.any(String),
        token: expect.any(String),
      },
    });

    deviceID = res.data.result.device_id;

    const device = await axios.get(`/device/${deviceID}`);

    expect(device.data.result).toMatchObject({
      id: deviceID,
      active: true,
      created_at: expect.any(String),
      inspected_at: null,
      last_input: null,
      last_output: null,
      payload_parser: null,
      tags: [],
      encoder_stack: null,
      updated_at: null,
      ...data,
    });
  });

  it("should create mutable device", async () => {
    const data: IDeviceCreate = {
      name: "test",
      data_retention: "forever",
      type: "mutable",
    };

    const res = await axios.post("/device", data);

    expect(res?.data).toMatchObject({
      status: true,
      result: {
        device_id: expect.any(String),
        token: expect.any(String),
      },
    });

    deviceID = res.data.result.device_id;

    const device = await axios.get(`/device/${deviceID}`);

    expect(device.data.result).toMatchObject({
      id: deviceID,
      active: true,
      created_at: expect.any(String),
      inspected_at: null,
      last_input: null,
      last_output: null,
      payload_parser: null,
      tags: [],
      encoder_stack: null,
      updated_at: null,
      ...data,
    });
  });
});
