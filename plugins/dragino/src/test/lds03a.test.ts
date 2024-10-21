import parserLDS03A from "../parser-lds03a.ts";

describe("Dragino LDS03A", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "001C2000000000" }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLDS03A(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const openStatus = payload.find(
      (item) => item.variable === "door_open_status",
    );
    const openTimes = payload.find((item) => item.variable === "open_times");
    const openDuration = payload.find(
      (item) => item.variable === "open_duration",
    );
    const alarm = payload.find((item) => item.variable === "alarm");
    const dataTime = payload.find((item) => item.variable === "data_time");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("001C2000000000");
    expect(openStatus?.value).toBe(3.042);
    expect(openTimes?.value).toBe(2);
    expect(openDuration?.value).toBe(1);
    expect(dataTime?.value).toBe(8);
    expect(alarm?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLDS03A(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
