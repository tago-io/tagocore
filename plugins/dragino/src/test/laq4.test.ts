import parserLAQ4 from "../parser-laq4.ts";

describe("Dragino LAQ4", () => {
  test("Success", async () => {
    const body = [
      {
        variable: "payload",
        value: "0d057c001e003c000007d0",
      },
      {
        variable: "port",
        value: "100",
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLAQ4(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const batV = payload.find((item) => item.variable === "Bat_V");
    const workMode = payload.find((item) => item.variable === "Work_mode");
    const alarmStatus = payload.find(
      (item) => item.variable === "Alarm_status",
    );
    const tvocPPB = payload.find((item) => item.variable === "TVOC_ppb");
    const co2PPM = payload.find((item) => item.variable === "CO2_ppm");
    const tempCSHT = payload.find((item) => item.variable === "TempC_SHT");
    const humSHT = payload.find((item) => item.variable === "Hum_SHT");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0d057c001e003c000007d0");
    expect(batV?.value).toBe(5.12);
    expect(workMode?.value).toBe(2);
    expect(alarmStatus?.value).toBe(3);
    expect(tvocPPB?.value).toBe(2);
    expect(co2PPM?.value).toBe(1);
    expect(tempCSHT?.value).toBe(8);
    expect(humSHT?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLAQ4(body);
    expect(Array.isArray(payload)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temperature = payload.find((x: any) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
