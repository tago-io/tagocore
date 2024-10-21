import { PayloadEncoderModule } from "@tago-io/tcore-sdk";
import parserAmbientLight from "./parser-AmbientLight.js";
import parserDoorWindowSensor from "./parser-DoorWIndowSensor.js";
import parserIndustrialTracker from "./parser-IndustrialTracker.js";
import parserMotionSensor from "./parser-MotionSensor.js";
import parserObjectLocator from "./parser-ObjectLocator.js";
import parserSoundLevel from "./parser-SoundLevel.js";
import parserTemperatureHumiditySensor from "./parser-TemperatureHumiditySensor.js";
import parserWaterLeak from "./parser-WaterLeak.js";
import parserHealthyHomeSensor from "./parser-iaqHealthyHomeSensor.js";

const encoderWaterLeak = new PayloadEncoderModule({
  id: "network-browan-water-leak",
  name: "Browan Water Leak",
});
const encoderTemperatureHumiditySensor = new PayloadEncoderModule({
  id: "network-browan-temperature-humidity-sensor",
  name: "Browan Temperature & Humidity Sensor",
});
const encoderSoundLevel = new PayloadEncoderModule({
  id: "network-browan-sound-level",
  name: "Browan Sound Level",
});
const encoderObjectLocator = new PayloadEncoderModule({
  id: "network-browan-object-locator",
  name: "Browan Object Locator",
});
const encoderMotionSensor = new PayloadEncoderModule({
  id: "network-browan-motion-sensor",
  name: "Browan Motion Sensor",
});
const encoderIndustrialTracker = new PayloadEncoderModule({
  id: "network-browan-industrial-tracker",
  name: "Browan Industrial Tracker",
});
const encoderHealthyHomeSensor = new PayloadEncoderModule({
  id: "network-browan-healthy-home-sensor-iaq",
  name: "Browan Healthy Home Sensor IAQ",
});
const encoderDoorWindowSensor = new PayloadEncoderModule({
  id: "network-browan-door-and-window-sensor",
  name: "Browan Door and Window Sensor",
});
const encoderAmbientLight = new PayloadEncoderModule({
  id: "network-browan-ambient-light",
  name: "Browan Ambient Light",
});

encoderWaterLeak.onCall = parserWaterLeak;
encoderTemperatureHumiditySensor.onCall = parserTemperatureHumiditySensor;
encoderSoundLevel.onCall = parserSoundLevel;
encoderObjectLocator.onCall = parserObjectLocator;
encoderMotionSensor.onCall = parserMotionSensor;
encoderIndustrialTracker.onCall = parserIndustrialTracker;
encoderHealthyHomeSensor.onCall = parserHealthyHomeSensor;
encoderDoorWindowSensor.onCall = parserDoorWindowSensor;
encoderAmbientLight.onCall = parserAmbientLight;
