import parserLSNPK01 from "../parser-lsnpk01.ts";

describe("Dragino LSNPK01", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "0D0A000000A100DC000010" }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLSNPK01(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const batV = payload.find((item) => item.variable === "batV");
    const tempcDS18B20 = payload.find(
      (item) => item.variable === "tempc_ds18b20",
    );
    const nSoil = payload.find((item) => item.variable === "n_soil");
    const pSoil = payload.find((item) => item.variable === "p_soil");
    const kSoil = payload.find((item) => item.variable === "k_soil");
    const interruptFlag = payload.find(
      (item) => item.variable === "interrupt_flag",
    );
    const messageType = payload.find(
      (item) => item.variable === "message_type",
    );
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0D0A000000A100DC000010");
    expect(batV?.value).toBe(3.042);
    expect(tempcDS18B20?.value).toBe(2);
    expect(nSoil?.value).toBe(1);
    expect(pSoil?.value).toBe(8);
    expect(kSoil?.value).toBe(2);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLSNPK01(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
