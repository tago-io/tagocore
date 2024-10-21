import parserLHT52 from "../parser-lht52.ts";

describe("Dragino LHT52", () => {
  test("Success", async () => {
    const body = [
      {
        variable: "payload",
        value: "08CD02207FFF0161CD4EDD",
      },
      {
        variable: "fport",
        value: 2,
      },
    ];

    const payload = await parserLHT52(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const tempCSHT = payload.find((item) => item.variable === "TempC_SHT");
    const humSHT = payload.find((item) => item.variable === "Hum_SHT");
    const tempCDS = payload.find((item) => item.variable === "TempC_DS");
    const ext = payload.find((item) => item.variable === "Ext");
    const sysTimestamp = payload.find(
      (item) => item.variable === "Systimestamp",
    );
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("08CD02207FFF0161CD4EDD");
    expect(tempCSHT?.value).toBe(3.042);
    expect(humSHT?.value).toBe(2.314);
    expect(tempCDS?.value).toBe(1.097);
    expect(ext?.value).toBe(2);
    expect(sysTimestamp?.value).toBe(1);
  });

  test("Failure", async () => {
    const body = [
      {
        variable: "temperature",
        value: 1,
      },
    ];

    const payload = await parserLHT52(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
