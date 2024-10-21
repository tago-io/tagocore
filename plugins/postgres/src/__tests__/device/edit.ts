import type { IDeviceCreate } from "@tago-io/tcore-sdk/types";
import axios from "axios";

let deviceID: string;

beforeAll(async () => {
  const data: IDeviceCreate = {
    name: "test",
    data_retention: "forever",
    type: "immutable",
  };

  const res = await axios.post("/device", data);

  deviceID = res.data.result.device_id;
});

afterAll(async () => {
  if (!deviceID) {
    return;
  }

  await axios.delete(`/device/${deviceID}`).catch();
});

describe("Edit device", () => {
  it("should edit tags", async () => {
    const data: IDeviceCreate = {
      name: "test",
      data_retention: "forever",
      type: "immutable",
      tags: [{ key: "tag1", value: "val" }],
    };

    const res = await axios.put(`/device/${deviceID}`, data);

    expect(res?.data).toMatchObject({
      status: true,
    });

    const device = await axios.get(`/device/${deviceID}`);

    expect(device?.data?.result?.tags).toStrictEqual(data.tags);
  });
});
