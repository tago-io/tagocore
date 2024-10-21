import parserLWL02 from "../parser-lwl02.ts";

describe("Dragino LWL-02", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "4BE20200000800000100" }];

    const payload = await parserLWL02(body);
    expect(Array.isArray(payload)).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const batV: any = payload.find((item) => item.variable === "bat_v");
    const mod = payload.find((item) => item.variable === "mod");
    const waterLeakStatus = payload.find(
      (item) => item.variable === "water_leak_status",
    );
    const waterLeakTimes = payload.find(
      (item) => item.variable === "water_leak_times",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastWaterLeakDuration: any = payload.find(
      (item) => item.variable === "last_water_leak_duration",
    );
    const payloadRaw = payload.find((item) => item.variable === "payload");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("4BE20200000800000100");
    expect(batV?.value).toBe(3.042);
    expect(mod?.value).toBe(2);
    expect(waterLeakStatus?.value).toBe(1);
    expect(waterLeakTimes?.value).toBe(8);
    expect(lastWaterLeakDuration?.value).toBe(1);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLWL02(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
