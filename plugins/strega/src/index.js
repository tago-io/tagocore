import { PayloadEncoderModule } from "@tago-io/tcore-sdk";
import parserSmartEmitterFull from "./parser-SmartEmitterFull.js";
import parserSmartEmitterLite from "./parser-SmartEmitterLite.js";
import parserSmartValveFull from "./parser-SmartValveFull.js";
import parserSmartValveLite from "./parser-SmartValveLite.js";

const encoderSmartValveLite = new PayloadEncoderModule({
  id: "network-actility-strega-smart-valve-lite",
  name: "Strega Smart Valve Lite Edition",
});
const encoderSmartValveFull = new PayloadEncoderModule({
  id: "network-actility-strega-smart-valve-full",
  name: "Strega Smart Valve Full Edition",
});
const encoderSmartEmitterLite = new PayloadEncoderModule({
  id: "network-actility-strega-smart-emitter-lite",
  name: "Strega Smart Emitter Lite Edition",
});
const encoderSmartEmitterFull = new PayloadEncoderModule({
  id: "network-actility-strega-smart-emitter-full",
  name: "Strega Smart Emitter Full Edition",
});

encoderSmartValveLite.onCall = parserSmartValveLite;
encoderSmartValveFull.onCall = parserSmartValveFull;
encoderSmartEmitterLite.onCall = parserSmartEmitterLite;
encoderSmartEmitterFull.onCall = parserSmartEmitterFull;
