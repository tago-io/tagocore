import { core, pluginStorage } from "@tago-io/tcore-sdk";

interface IRetainMQTT {
  payload: string;
  device: string;
  topic: string;
  qos: number;
  messageId: string;
}

async function retainMQTT(model: IRetainMQTT) {
  const database = await core.getDeviceInfo(model.device).catch(() => null);

  if (database === null) {
    return Promise.reject("Invalid device");
  }
  return pluginStorage.set(`${database.id}_retain_${model.topic}`, model);
}

async function getRetainedMQTT(device: string, topic: string) {
  const database = await core.getDeviceInfo(device).catch(() => null);

  if (database === null) {
    return Promise.reject("Invalid device");
  }
  return pluginStorage.get(`${database.id}_retain_${topic}`);
}

export { retainMQTT, getRetainedMQTT, type IRetainMQTT };
