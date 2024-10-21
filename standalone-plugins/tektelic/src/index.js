import { PayloadEncoderModule } from "@tago-io/tcore-sdk";
import parserTundraSensor from "./parser-TundraSensor";
import parserSmartHomeSensor from "./parser-SmartHomeSensor";
import parserSafeAlert from "./parser-SafeAlert";
import parserPanicButtonSensor from "./parser-PanicButtonSensor";
import parserMulchTemperatureSensor from "./parser-MulchTemperatureSensor";
import parserIndustrialTransceiver from "./parser-IndustrialTransceiver";
import parserIndustrialGpsAssetTracker from "./parser-IndustrialGpsAssetTracker";

import parserColdRoomTemperature from "./parser-ColdRoomTemperature";
import parserColdRoom from "./parser-ColdRoom";
import parserBleAssetTracker from "./parser-BleAssetTracker";
import parserAssetTracker from "./parser-AssetTracker";
import parserAgricultureSensor from "./parser-AgricultureSensor";
import parserAcOutletSwitch from "./parser-AcOutletSwitch";

const encoderTundraSensor = new PayloadEncoderModule({
  id: "network-tektelic-tundra-sensor",
  name: "Tektelic Tundra Sensor",
});
const encoderSmartHomeSensor = new PayloadEncoderModule({
  id: "network-tektelic-smart-home-sensor",
  name: "Tektelic Smart Home Sensor",
});
const encoderSafeAlert = new PayloadEncoderModule({
  id: "network-tektelic-safe-alert",
  name: "Tektelic SafeAlert",
});
const encoderPanicButtonSensor = new PayloadEncoderModule({
  id: "network-tektelic-panic-button-sensor",
  name: "Tektelic Panic Button Sensor",
});
const encoderMulchTemperatureSensor = new PayloadEncoderModule({
  id: "network-tektelic-mulch-temperature-sensor",
  name: "Tektelic Mulch Temperature Sensor",
});
const encoderIndustrialTransceiver = new PayloadEncoderModule({
  id: "network-tektelic-industrial-transceiver",
  name: "Tektelic Industrial Transceiver",
});
const encoderIndustrialGpsAssetTracker = new PayloadEncoderModule({
  id: "network-tektelic-industrial-gps-asset-tracker",
  name: "Tektelic Industrial GPS Asset Tracker",
});
const encoderColdRoomTemperature = new PayloadEncoderModule({
  id: "network-tektelic-cold-room-temperature",
  name: "Tektelic Cold Room Temperature",
});
const encoderColdRoom = new PayloadEncoderModule({
  id: "network-tektelic-cold-room",
  name: "Tektelic Cold Room",
});
const encoderBleAssetTracker = new PayloadEncoderModule({
  id: "network-tektelic-ble-asset-tracker",
  name: "Tektelic BLE Asset Tracker",
});
const encoderAssetTracker = new PayloadEncoderModule({
  id: "network-tektelic-asset-tracker",
  name: "Tektelic Asset Tracker",
});
const encoderAgricultureSensor = new PayloadEncoderModule({
  id: "network-tektelic-agriculture-sensor",
  name: "Tektelic Agriculture Sensor",
});
const encoderAcOutletSwitch = new PayloadEncoderModule({
  id: "network-tektelic-ac-outlet-and-switch",
  name: "Tektelic AC Outlet and Switch",
});

encoderTundraSensor.onCall = parserTundraSensor;
encoderSmartHomeSensor.onCall = parserSmartHomeSensor;
encoderSafeAlert.onCall = parserSafeAlert;
encoderPanicButtonSensor.onCall = parserPanicButtonSensor;
encoderMulchTemperatureSensor.onCall = parserMulchTemperatureSensor;
encoderIndustrialTransceiver.onCall = parserIndustrialTransceiver;
encoderIndustrialGpsAssetTracker.onCall = parserIndustrialGpsAssetTracker;
encoderColdRoomTemperature.onCall = parserColdRoomTemperature;
encoderColdRoom.onCall = parserColdRoom;
encoderBleAssetTracker.onCall = parserBleAssetTracker;
encoderAssetTracker.onCall = parserAssetTracker;
encoderAgricultureSensor.onCall = parserAgricultureSensor;
encoderAcOutletSwitch.onCall = parserAcOutletSwitch;
