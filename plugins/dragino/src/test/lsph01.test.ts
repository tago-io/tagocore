import parserLSPH01 from "../parser-lsph01.ts";

describe("Dragino LSPH01", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "0D250000003E0100000000" }];

    const payload = await parserLSPH01(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const batV = payload.find((item) => item.variable === "bat_v");
    const tempcDS18B20 = payload.find(
      (item) => item.variable === "tempc_ds18b20",
    );
    const ph1Soil = payload.find((item) => item.variable === "ph1_soil");
    const tempSoil = payload.find((item) => item.variable === "temp_soil");
    const interruptFlag = payload.find(
      (item) => item.variable === "interrupt_flag",
    );
    const messageType = payload.find(
      (item) => item.variable === "message_type",
    );
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0D250000003E0100000000");
    expect(batV?.value).toBe(3.042);
    expect(tempcDS18B20?.value).toBe(2);
    expect(ph1Soil?.value).toBe(1);
    expect(tempSoil?.value).toBe(8);
    expect(interruptFlag?.value).toBe(1);
    expect(messageType?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    const payload = await parserLSPH01(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
