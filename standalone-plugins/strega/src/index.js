import { PayloadEncoderModule } from "@tago-io/tcore-sdk";
import parserSmartValveLite from "./parser-SmartValveLite";
import parserSmartValveFull from "./parser-SmartValveFull";
import parserSmartEmitterLite from "./parser-SmartEmitterLite";
import parserSmartEmitterFull from "./parser-SmartEmitterFull";

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
