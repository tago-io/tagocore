import type { IDevice, IDeviceCreate } from "@tago-io/tcore-sdk/types";
import axios from "axios";

const deviceIDs: string[] = [];

beforeAll(async () => {
  const data: IDeviceCreate = {
    name: "test",
    data_retention: "forever",
    type: "immutable",
    tags: [{ key: "test", value: "integration" }],
  };

  const res = await axios.post("/device", data);

  deviceIDs.push(res.data.result.device_id);
});

afterAll(async () => {
  if (!deviceIDs.length) {
    return;
  }

  for (const id of deviceIDs) {
    await axios.delete(`/device/${id}`).catch();
  }
});

describe("List device", () => {
  it("List device by tag", async () => {
    const res = await axios.get("/device/", {
      params: {
        filter: { tags: [{ key: "test", value: "integration" }] },
      },
    });

    expect(res?.data?.status).toBeTruthy();
    expect(res?.data?.result?.length).toBeGreaterThan(0);

    for (const device of res.data.result as IDevice[]) {
      expect(typeof device.id).toBe("string");

      const containTag = device.tags.findIndex((value) => {
        return value?.key === "test" && value?.value === "integration";
      });
      expect(containTag >= 0).toBeTruthy();
    }
  });
});
