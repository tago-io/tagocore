import parserLGT92 from "../parser-lgt92.ts";

describe("Dragino LGT92", () => {
  test("Success", async () => {
    const body = [
      {
        variable: "time",
        value: 1571874770.422976,
        serie: 1571874770524,
      },
      {
        variable: "payload",
        value: "0571e6f3f8bc0fe31672f934",
        serie: 1571874770524,
      },
      {
        variable: "port",
        value: 2,
        serie: 1571874770524,
      },
      {
        variable: "duplicate",
        value: false,
        serie: 1571874770524,
      },
      {
        variable: "counter_up",
        value: 38,
        serie: 1571874770524,
      },
      {
        variable: "rx_time",
        value: 1571874770.3568993,
        serie: 1571874770524,
      },
      {
        variable: "encrypted_payload",
        value: "c12oeBn03DxbfqcD",
        serie: 1571874770524,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLGT92(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const lat = payload.find((item) => item.variable === "latitude");
    const lng = payload.find((item) => item.variable === "longitude");
    const roll = payload.find((item) => item.variable === "roll");
    const pitch = payload.find((item) => item.variable === "pitch");
    const batV = payload.find((item) => item.variable === "batV");
    const alarmStatus = payload.find((item) => item.variable === "alarm");
    const md = payload.find((item) => item.variable === "md");
    const lon = payload.find((item) => item.variable === "led_updown");
    const fw = payload.find((item) => item.variable === "Firmware");
    const hdop = payload.find((item) => item.variable === "hdop");
    const altitude = payload.find((item) => item.variable === "altitude");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0571e6f3f8bc0fe31672f934");
    expect(batV?.value).toBe(5.12);
    expect(lat?.value).toBe(2);
    expect(lng?.value).toBe(3.042);
    expect(roll?.value).toBe(2);
    expect(pitch?.value).toBe(1);
    expect(batV?.value).toBe(8);
    expect(alarmStatus?.value).toBe(3.042);
    expect(md?.value).toBe(2);
    expect(lon?.value).toBe(1);
    expect(fw?.value).toBe(8);
    expect(hdop?.value).toBe(1);
    expect(altitude?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLGT92(body);
    expect(Array.isArray(payload)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temperature = payload.find((x: any) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
