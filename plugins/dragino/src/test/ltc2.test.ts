import parserLTC2 from "../parser-ltc2.ts";

describe("Dragino LTC2", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "0CE9011422EC2D6073E83B" }];

    const payload = await parserLTC2(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const ext = payload.find((item) => item.variable === "Ext");
    const batV = payload.find((item) => item.variable === "BatV");
    const tempChannel1 = payload.find(
      (item) => item.variable === "Temp_Channel1",
    );
    const tempChannel2 = payload.find(
      (item) => item.variable === "Temp_Channel2",
    );
    const sysTimestamp = payload.find(
      (item) => item.variable === "Systimestamp",
    );
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0CE9011422EC2D6073E83B");
    expect(ext?.value).toBe(3.042);
    expect(batV?.value).toBe(2);
    expect(tempChannel1?.value).toBe(1);
    expect(tempChannel2?.value).toBe(8);
    expect(sysTimestamp?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    const payload = await parserLTC2(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
