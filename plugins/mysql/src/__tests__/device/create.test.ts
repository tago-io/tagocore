import axios from "axios";

describe("Create device", () => {
  it("should create immutable device", async () => {
    const data = {
      name: "test",
      data_retention: "forever",
      type: "immutable",
    };

    const res = await axios.post("/device", data);

    expect(res.data).toMatchObject({
      status: true,
      result: {
        device_id: expect.any(String),
        token: expect.any(String),
      },
    });

    const deviceID = res.data.result.device_id;

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

    const deleteRes = await axios.delete(`/device/${deviceID}`);

    expect(deleteRes.data.status).toBeTruthy();

    const deviceNotFound = async () => {
      await axios.get(`/device/${deviceID}`);
    };

    expect(deviceNotFound).rejects.toThrow();
  });
});
