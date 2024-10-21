import parserLHT65 from "../parser-lht65.ts";

describe("Dragino LHT65", () => {
  test("Success", async () => {
    const body = [
      { variable: "payload", value: "cb060b5b02770400017fff" },
      { variable: "fport", value: "2" },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLHT65(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const battery = payload.find((item) => item.variable === "batV");
    const tempDS = payload.find((item) => item.variable === "temp_ds");
    const tempSHT = payload.find((item) => item.variable === "temp_SHT");
    const humSHT = payload.find((item) => item.variable === "hum_SHT");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("cb060b5b02770400017fff");
    expect(battery?.value).toBe(3.042);
    expect(tempDS?.value).toBe(2);
    expect(tempSHT?.value).toBe(1);
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
    const payload = await parserLHT65(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
