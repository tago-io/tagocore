import parserLDDS75 from "../parser-ldds75.ts";

describe("Dragino LDDS75", () => {
  test("Success", async () => {
    const body = [
      {
        variable: "time",
        value: 1571874770.422976,
        serie: 1571874770524,
      },
      {
        variable: "payload",
        value: "4Be202000008000001",
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
    const payload = await parserLDDS75(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const batV = payload.find((item) => item.variable === "batV");
    const distance = payload.find((item) => item.variable === "distance");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("4Be202000008000001");
    expect(batV?.value).toBe(5.12);
    expect(distance?.value).toBe(2);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLDDS75(body);
    expect(Array.isArray(payload)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const temperature = payload.find((x: any) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
