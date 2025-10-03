import toTagoFormat, { type IDeviceDataLatLng } from "../lib/toTagoFormat.ts";

interface IRXInfo {
  time: string;
  timeSinceGPSEpoch: string;
  rssi: number;
  loRaSNR: number;
  channel: number;
  rfChain: number;
  board: string;
  antenna: number;
  location: {
    latitude: number;
    longitude: number;
  };
  gatewayID: string;
  fineTimestampType: string;
  context: string;
}

/**
 * Parse the RX Info of the Chirpstack payload. Usually contains gateway information
 *
 * @param data - RX info data
 * @param group - group of the group
 * @returns
 */
function parseRxInfo(data: IRXInfo[], group: string) {
  const result: IDeviceDataLatLng[] = [];
  for (let i = 0; i < data.length; ++i) {
    // gatewayID (base64)
    if (data[i].gatewayID)
      result.push({
        variable: `rx_${i}_gateway_id`,
        value: Buffer.from(data[i].gatewayID, "base64").toString("hex"),
        group,
      });
    // time (string)
    if (data[i].time)
      result.push({ variable: `rx_${i}_time`, value: data[i].time, group });
    // time since gps epoch
    if (data[i].timeSinceGPSEpoch)
      result.push({
        variable: `rx_${i}_time_since_gps_epoch`,
        value: data[i].timeSinceGPSEpoch,
        group,
      });
    // rssi (integer)
    if (data[i].rssi)
      result.push({ variable: `rx_${i}_rssi`, value: data[i].rssi, group });
    // loRaSNR (integer)
    if (data[i].loRaSNR)
      result.push({
        variable: `rx_${i}_lorasnr`,
        value: data[i].loRaSNR,
        group,
      });
    // channel (integer)
    if (data[i].channel)
      result.push({
        variable: `rx_${i}_channel`,
        value: data[i].channel,
        group,
      });
    // rfChain (integer)
    if (data[i].rfChain)
      result.push({
        variable: `rx_${i}_rf_chain`,
        value: data[i].rfChain,
        group,
      });
    // board (integer)
    if (data[i].board)
      result.push({ variable: `rx_${i}_board`, value: data[i].board, group });
    // antenna (integer)
    if (data[i].antenna)
      result.push({
        variable: `rx_${i}_antenna`,
        value: data[i].antenna,
        group,
      });
    // location latitude (double)
    if (data[i].location?.latitude && data[i].location.longitude) {
      result.push({
        variable: `rx_${i}_location`,
        value: `${data[i].location.latitude},${data[i].location.longitude}`,
        location: {
          lng: data[i].location.longitude,
          lat: data[i].location.latitude,
        },
        group,
      });
    }

    // result.push({ variable: `rx_${i}_location_altitude`, value: data[i].location.altitude, group: group });
    // // fine timestamp type (string)
    if (data[i].fineTimestampType)
      result.push({
        variable: `rx_${i}_fine_timestamp_type`,
        value: data[i].fineTimestampType,
        group,
      });
    // context (base64)
    if (data[i].context)
      result.push({
        variable: `rx_${i}_context`,
        value: Buffer.from(data[i].context, "base64").toString("hex"),
        group,
      });
    // // // uplink id (base64)
    // // result.push({ variable: `rx_${i}_uplink_id`, value: Buffer.from(data[i].uplinkID, "base64").toString("hex"), serie: serie });
  }

  return result;
}

interface ITxInfo {
  frequency: number;
  modulation: string | any;
  loRaModulationInfo: {
    bandwidth: number;
    spreadingFactor: number;
    codeRate: number;
    polarizationInversion: number;
  };
}

/**
 * Parse the TX Info of the Chirpstack payload. Usually contains transceiver information
 *
 * @param data - TX data
 * @param serie - = serie of the group
 * @returns
 */
function parseTxInfo(data: ITxInfo, serie: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: IDeviceDataLatLng[] = [];

  // frequency (integer)
  if (data.frequency)
    result.push({ variable: "frequency", value: data.frequency, serie });
  // modulation (string)
  if (data.modulation && typeof data.modulation === "string") {
    result.push({ variable: "modulation", value: data.modulation, serie });
  }
  // lora modulation info (integer)
  if (data.loRaModulationInfo) {
    result.push({
      variable: "bandwidth",
      value: data.loRaModulationInfo.bandwidth,
      serie,
    });
    // spreading factor (integer)
    result.push({
      variable: "spreading_factor",
      value: data.loRaModulationInfo.spreadingFactor,
      serie,
    });
    // code rate (string)
    result.push({
      variable: "code_rate",
      value: data.loRaModulationInfo.codeRate,
      serie,
    });
    // polarization inversion (boolean)
    result.push({
      variable: "polarization_inversion",
      value: data.loRaModulationInfo.polarizationInversion,
      serie,
    });
  }
  if (data.modulation.lora) {
    result.push({ variable: "modulation", value: "LORA", serie });
    result.push({
      variable: "bandwidth",
      value: data.modulation.lora.bandwidth,
      serie,
    });
    // spreading factor (integer)
    result.push({
      variable: "spreading_factor",
      value: data.modulation.lora.spreadingFactor,
      serie,
    });
    // code rate (string)
    result.push({
      variable: "code_rate",
      value: data.modulation.lora.codeRate,
      serie,
    });
  }
  return result;
}

/**
 * Decode data from Chirpstack
 *
 * @param payload - any payload sent by the device
 * @returns data to be stored
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function parser(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }

  let toTago: IDeviceDataLatLng[] = [];
  const serie = String(new Date().getTime());

  // rename
  if (payload.applicationID) {
    payload.application_id = payload.applicationID;
    payload.applicationID = undefined;
  }
  if (payload.applicationName) {
    payload.application_name = payload.applicationName;
    payload.applicationName = undefined;
  }
  if (payload.deviceName) {
    payload.device_name = payload.deviceName;
    payload.adeviceName = undefined;
  }
  if (payload.devEUI) {
    payload.device_eui = payload.devEU;
    payload.devEUI = undefined;
  }
  if (payload.deviceInfo.applicationID) {
    payload.application_id = payload.deviceInfo.applicationID;
    payload.deviceInfo.applicationID = undefined;
  }
  if (payload.deviceInfo.applicationName) {
    payload.application_name = payload.deviceInfo.applicationName;
    payload.deviceInfo.applicationName = undefined;
  }
  if (payload.deviceInfo.deviceName) {
    payload.device_name = payload.deviceInfo.deviceName;
    payload.deviceInfo.adeviceName = undefined;
  }
  if (payload.deviceInfo.devEui) {
    payload.device_eui = payload.deviceInfo.devEui;
    payload.deviceInfo.devEui = undefined;
  }
  if (payload.externalPowerSource) {
    payload.external_power_source = payload.externalPowerSource;
    payload.externalPowerSource = undefined;
  }
  if (payload.externalLevelUnavailable) {
    payload.external_level_unavailable = payload.externalLevelUnavailable;
    payload.externalLevelUnavailable = undefined;
  }
  if (payload.batteryLevel) {
    payload.battery_level = payload.batteryLevel;
    payload.batteryLevel = undefined;
  }

  // base64 variables
  if (payload.devAddr) {
    payload.dev_addr = Buffer.from(payload.devAddr, "base64").toString("hex");
    payload.devAddr = undefined;
  }
  if (payload.data) {
    payload.payload = Buffer.from(payload.data, "base64").toString("hex");
    payload.data = undefined;
  }

  // Parse rx info
  if (payload.rxInfo) {
    toTago = toTago.concat(parseRxInfo(payload.rxInfo, serie));
    payload.rxInfo = undefined;
  }
  // Parse tx info
  if (payload.txInfo) {
    toTago = toTago.concat(parseTxInfo(payload.txInfo, serie));
    payload.txInfo = undefined;
  }
  // Tags
  if (payload.tags) {
    toTago = toTago.concat(toTagoFormat(payload.tags, serie));
    payload.tags = undefined;
  }

  toTago = toTago.concat(toTagoFormat(payload, serie));
  console.log(toTago);
  toTago = toTago.filter(
    (x) => !x.location || (x.location.lat !== 0 && x.location.lng !== 0),
  );

  return toTago;
}
