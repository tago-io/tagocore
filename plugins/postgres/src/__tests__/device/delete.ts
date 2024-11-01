import type { IDeviceCreate } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { afterEach, beforeEach, describe, it } from "vitest";

let deviceID: string | undefined;

beforeEach(async () => {
  const data: IDeviceCreate = {
    name: "test",
    data_retention: "forever",
    type: "immutable",
    tags: [{ key: "test", value: "integration" }],
  };

  const res = await axios.post("/device", data);

  deviceID = res.data.result.device_id;
});

afterEach(async () => {
  if (!deviceID) {
    return;
  }

  await axios.delete(`/device/${deviceID}`).catch(console.error);
  deviceID = undefined;
});

describe("Delete device", () => {
  it("should work", async () => {
    const id = deviceID;
    const res = await axios.delete(`/device/${deviceID}`);

    deviceID = undefined;

    expect(res?.data?.status).toBeTruthy();

    const spy = vi.fn();
    await axios.get(`/device/${id}`).catch(spy);
    expect(spy).toHaveBeenCalled();
  });
});
