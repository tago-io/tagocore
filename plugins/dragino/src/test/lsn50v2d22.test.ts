import parserLSN50V2 from "../parser-lsn50v2d22.ts";

describe("Dragino LSN50V2-D22", () => {
  test("Success", async () => {
    const body = [
      { variable: "payload", value: "0CF10111011300FFFFFFFF" },
      {
        variable: "port",
        value: 2,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLSN50V2(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const workMode = payload.find((item) => item.variable === "Work_mode");
    const batV = payload.find((item) => item.variable === "BatV");
    const adcCH0V = payload.find((item) => item.variable === "ADC_CH0V");
    const adcCH1V = payload.find((item) => item.variable === "ADC_CH1V");
    const adcCH4V = payload.find((item) => item.variable === "ADC_CH4V");
    const digitalIstatus = payload.find(
      (item) => item.variable === "Digital_ISatus",
    );
    const extiTrigger = payload.find(
      (item) => item.variable === "EXTI_Trigger",
    );
    const doorStatus = payload.find((item) => item.variable === "Door_status");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0CF10111011300FFFFFFFF");
    expect(workMode?.value).toBe(3.042);
    expect(batV?.value).toBe(2);
    expect(adcCH0V?.value).toBe(1);
    expect(adcCH1V?.value).toBe(8);
    expect(adcCH4V?.value).toBe(8);
    expect(digitalIstatus?.value).toBe(8);
    expect(extiTrigger?.value).toBe(8);
    expect(doorStatus?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLSN50V2(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
