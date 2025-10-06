import { describe, expect, test } from "vitest";
import parser from "../Services/parser.ts";
import type { IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

describe("Chirpstack Parser unit tests", () => {
  test("Chirpstack V3 payload parsing", async () => {
    const v3Payload = {
      applicationID: "3",
      applicationName: "Draginos",
      deviceName: "DRA-8805",
      devEUI: "d385c35b342d5e29",
      rxInfo: [
        {
          gatewayID: "cHb/AGYDAq0=",
          time: "2022-03-10T18:16:02.753475Z",
          timeSinceGPSEpoch: null,
          rssi: -101,
          loRaSNR: 11.5,
          channel: 0,
          rfChain: 0,
          board: 0,
          antenna: 0,
          location: {
            latitude: -33.39311102551892,
            longitude: -70.75781112102258,
            altitude: 0,
            source: "UNKNOWN",
            accuracy: 0,
          },
          fineTimestampType: "NONE",
          context: "rrxYTA==",
          uplinkID: "jWLolBVuRha5bfwCdy2hIw==",
          crcStatus: "CRC_OK",
        },
      ],
      txInfo: {
        frequency: 915200000,
        modulation: "LORA",
        loRaModulationInfo: {
          bandwidth: 125,
          spreadingFactor: 9,
          codeRate: "4/5",
          polarizationInversion: false,
        },
      },
      adr: false,
      dr: 3,
      fCnt: 1397,
      fPort: 2,
      objectJSON:
        '{"Ext_sensor":"Temperature Sensor","name": "Device Chirpstacl","bateria":3.025,"humedad":34.3,"temperatura":25.12,"temperatura2":327.67}',
      tags: {},
      confirmedUplink: false,
      devAddr: "AHCxJw==",
      payload: "y9EJ0AFXAX//f/8=",
    };

    const result: IDeviceDataLatLng[] = await parser(v3Payload);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Check device metadata
    const deviceEUI = result.find((item) => item.variable === "device_eui");
    expect(deviceEUI?.value).toBe("d385c35b342d5e29");

    const appName = result.find((item) => item.variable === "application_name");
    expect(appName?.value).toBe("Draginos");

    const deviceName = result.find((item) => item.variable === "device_name");
    expect(deviceName?.value).toBe("DRA-8805");

    // Check TX info - modulation as string
    const modulation = result.find((item) => item.variable === "modulation");
    expect(modulation?.value).toBe("LORA");

    const frequency = result.find((item) => item.variable === "frequency");
    expect(frequency?.value).toBe(915200000);

    const bandwidth = result.find((item) => item.variable === "bandwidth");
    expect(bandwidth?.value).toBe(125);

    const spreadingFactor = result.find(
      (item) => item.variable === "spreading_factor",
    );
    expect(spreadingFactor?.value).toBe(9);

    // Check RX info
    const rssi = result.find((item) => item.variable === "rx_0_rssi");
    expect(rssi?.value).toBe(-101);

    const lorasnr = result.find((item) => item.variable === "rx_0_lorasnr");
    expect(lorasnr?.value).toBe(11.5);

    // Check location
    const location = result.find((item) => item.variable === "rx_0_location");
    expect(location?.location?.lat).toBe(-33.39311102551892);
    expect(location?.location?.lng).toBe(-70.75781112102258);

    // Check payload
    const payloadHex = result.find((item) => item.variable === "payload");
    expect(payloadHex?.value).toBeTruthy();
  });

  test("Chirpstack V4 payload parsing", async () => {
    const v4Payload = {
      deduplicationId: "1ceccb3b-72c1-4bf9-9213-d0ad34693082",
      time: "2025-10-03T18:59:08.546+00:00",
      deviceInfo: {
        tenantId: "b251dfba-40bb-4daf-bbf6-d8c5a49c863f",
        tenantName: "training_tanant",
        applicationId: "1ebc0dde-8f17-43ae-854b-e72b73fcc174",
        applicationName: "training-application",
        deviceProfileId: "991bc8e0-a2ca-4c5c-b577-42e8ac567a4b",
        deviceProfileName: "training-device-profile",
        deviceName: "training_device",
        devEui: "d385c35b342d5e29",
        deviceClassEnabled: "CLASS_A",
        tags: {},
      },
      devAddr: "018e497b",
      adr: false,
      dr: 0,
      fCnt: 1360,
      fPort: 1,
      confirmed: true,
      data: "VGVzdCBzZW5kIERhdGE=",
      rxInfo: [
        {
          gatewayId: "58d1b19ce8c25e09",
          uplinkId: 56182,
          gwTime: "2025-10-03T18:59:08+00:00",
          nsTime: "2025-10-03T18:59:08.551054938+00:00",
          timeSinceGpsEpoch: "1443553166.546s",
          rssi: -60,
          snr: 7,
          channel: 7,
          location: {
            latitude: 0,
            longitude: 0,
          },
          context: "aOAc/A==",
          crcStatus: "CRC_OK",
        },
      ],
      txInfo: {
        frequency: 867900000,
        modulation: {
          lora: {
            bandwidth: 125000,
            spreadingFactor: 12,
            codeRate: "CR_4_5",
          },
        },
      },
      regionConfigId: "eu868",
    };

    const result: IDeviceDataLatLng[] = await parser(v4Payload);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Check device metadata from deviceInfo
    const deviceEUI = result.find((item) => item.variable === "device_eui");
    expect(deviceEUI?.value).toBe("d385c35b342d5e29");

    const appName = result.find((item) => item.variable === "application_name");
    expect(appName?.value).toBe("training-application");

    const deviceName = result.find((item) => item.variable === "device_name");
    expect(deviceName?.value).toBe("training_device");

    // Check TX info - modulation as object
    const modulation = result.find((item) => item.variable === "modulation");
    expect(modulation?.value).toBe("LORA");

    const frequency = result.find((item) => item.variable === "frequency");
    expect(frequency?.value).toBe(867900000);

    const bandwidth = result.find((item) => item.variable === "bandwidth");
    expect(bandwidth?.value).toBe(125000);

    const spreadingFactor = result.find(
      (item) => item.variable === "spreading_factor",
    );
    expect(spreadingFactor?.value).toBe(12);

    const codeRate = result.find((item) => item.variable === "code_rate");
    expect(codeRate?.value).toBe("CR_4_5");

    // Check payload from 'data' field
    const payloadHex = result.find((item) => item.variable === "payload");
    expect(payloadHex?.value).toBeTruthy();
  });
});
