import parserLWL01 from "../parser-lwl01.ts";

describe("Dragino LWL-01", () => {
  test("Success", async () => {
    const body = [
      {
        variable: "time",
        value: 1571874770.422976,
        group: "1571874770524",
      },
      {
        variable: "payload",
        value: "4Be202000008000001",
        group: "1571874770524",
      },
      {
        variable: "port",
        value: 2,
        group: "1571874770524",
      },
      {
        variable: "duplicate",
        value: false,
        group: "1571874770524",
      },
      {
        variable: "counter_up",
        value: 38,
        group: "1571874770524",
      },
      {
        variable: "rx_time",
        value: 1571874770.3568993,
        group: "1571874770524",
      },
      {
        variable: "encrypted_payload",
        value: "c12oeBn03DxbfqcD",
        group: "1571874770524",
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLWL01(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const battery = payload.find((item) => item.variable === "bat_v");
    const mod = payload.find((item) => item.variable === "mod");
    const waterLeak = payload.find(
      (item) => item.variable === "water_leak_status",
    );
    const waterLeakTimes = payload.find(
      (item) => item.variable === "water_leak_times",
    );
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("4Be202000008000001");
    expect(battery?.value).toBe(3.042);
    expect(mod?.value).toBe(2);
    expect(waterLeak?.value).toBe(1);
    expect(waterLeakTimes?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLWL01(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
