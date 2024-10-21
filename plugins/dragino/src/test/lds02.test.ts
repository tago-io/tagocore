import parserLDS02 from "../parser-lds02.ts";

describe("Dragino LDS02", () => {
  test("Success", async () => {
    const body = [{ variable: "payload", value: "0D250000003E0100000000" }];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLDS02(body);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const batV = payload.find((item) => item.variable === "bat_v");
    const mod = payload.find((item) => item.variable === "mod");
    const doorOpenStatus = payload.find(
      (item) => item.variable === "door_open_status",
    );
    const doorOpenTimes = payload.find(
      (item) => item.variable === "door_open_times",
    );
    const lastDoorOpenDuration = payload.find(
      (item) => item.variable === "last_door_open_duration",
    );
    const alarm = payload.find((item) => item.variable === "alarm");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe("0D250000003E0100000000");
    expect(batV?.value).toBe(3.042);
    expect(mod?.value).toBe(2);
    expect(doorOpenStatus?.value).toBe(1);
    expect(doorOpenTimes?.value).toBe(8);
    expect(lastDoorOpenDuration?.value).toBe(1);
    expect(alarm?.value).toBe(8);
  });

  test("Parser shouldn't run", async () => {
    const body = [
      {
        variable: "temperature",
        value: 11,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = await parserLDS02(body);
    expect(Array.isArray(payload)).toBe(true);

    const temperature = payload.find((x) => x.variable === "temperature");
    expect(temperature).toBeTruthy();
  });
});
