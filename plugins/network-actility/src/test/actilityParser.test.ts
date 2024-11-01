import { describe, expect, test } from "vitest";
import actilityParser from "../Services/parser.ts";
import type { IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

describe("Decoder unit test", () => {
  test("Actility Result", async () => {
    const body = {
      Time: "2022-03-16T15:22:32.427+01:00",
      DevEUI: "0004A30B00087103",
      FPort: 22,
      FCntUp: 13643,
      MType: 4,
      FCntDn: 11028,
      payload_hex:
        "a978e807c0070800626a2003e80307000400de010ffd401c5f8254020209696f676f75e9",
      mic_hex: "d9a3bc9a",
      Lrcid: "0000020F",
      LrrRSSI: -113,
      LrrSNR: 3,
      LrrESP: -114.764351,
      SpFact: 12,
      SubBand: "G1",
      Channel: "LC3",
      DevLrrCnt: 1,
      Lrrid: "00003EE3",
      Late: 0,
      LrrLAT: 45.504021,
      LrrLON: 19.527136,
      Lrrs: {
        Lrr: [
          {
            Lrrid: "00003EE3",
            Chain: 0,
            LrrRSSI: -113,
            LrrSNR: 3,
            LrrESP: -114.764351,
          },
        ],
      },
      DevLocTime: "2022-03-16T15:22:26.359+01:00",
      DevLAT: 45.504021,
      DevLON: 19.527136,
      DevAlt: 0,
      DevLocRadius: 5000,
      DevAltRadius: 0,
      DevUlFCntUpUsed: 13642,
      DevLocDilution: 10,
      DevAltDilution: 0,
      DevNorthVel: 0,
      DevEastVel: 0,
      NwGeolocAlgo: 2,
      NwGeolocAlgoUsed: 1,
      CustomerID: "1100000234",
      CustomerData: { alr: { pro: "LORA/Generic", ver: "1" } },
      ModelCfg: "0",
      InstantPER: 0,
      MeanPER: 0,
      DevAddr: "04402738",
      TxPower: 14,
      NbTrans: 1,
      Frequency: 868.5,
      DynamicClass: "A",
      as_id: "TWA_1100000234.301",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: IDeviceDataLatLng[] = await actilityParser(body as any);
    expect(Array.isArray(payload)).toBe(true);

    const payloadRaw = payload.find((item) => item.variable === "payload");
    const fport = payload.find((item) => item.variable === "fport");
    const rssi = payload.find((item) => item.variable === "lrrrssi");
    const snr = payload.find((item) => item.variable === "lrrsnr");
    expect(payloadRaw?.value).toBeTruthy();
    expect(payloadRaw?.value).toBe(
      "a978e807c0070800626a2003e80307000400de010ffd401c5f8254020209696f676f75e9",
    );
    expect(fport?.value).toBeTruthy();
    expect(fport?.value).toBe(22);
    expect(rssi?.value).toBeTruthy();
    expect(snr?.value).toBeTruthy();
  });
});
