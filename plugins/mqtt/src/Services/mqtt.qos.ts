import { core, pluginStorage } from "@tago-io/tcore-sdk";

interface IQOSMessage {
  topic: string;
  payload: string;
  qos: number;
  messageId: string;
}

async function storeQOSMessage(device_id: string, model: IQOSMessage) {
  const database = await core.getDeviceInfo(device_id).catch(() => null);

  if (database === null) {
    return Promise.reject("Invalid device");
  }
  return pluginStorage.set(
    `${database.id}_QOS_${model.topic}_${model.messageId}`,
    model,
  );
}

async function delQOSMessage(
  device_id: string,
  topic: string,
  message_id: string,
) {
  const database = await core.getDeviceInfo(device_id).catch(() => null);

  if (database === null) {
    return Promise.reject("Invalid device");
  }
  return pluginStorage.delete(`${database.id}_QOS_${topic}_${message_id}`);
}

async function getQOSMessage(
  device_id: string,
  topic: string,
): Promise<IQOSMessage[]> {
  const database = await core.getDeviceInfo(device_id).catch(() => null);

  if (database === null) {
    return Promise.reject("Invalid device");
  }
  const storedKeys: string[] = await pluginStorage.getAllItems();
  const topicKeys = storedKeys.filter((key) =>
    key?.includes?.(`${database.id}_QOS_${topic}_`),
  );

  const messages: IQOSMessage[] = [];
  for (const key of topicKeys) {
    const content = await pluginStorage.get(key);
    messages.push(content);
  }

  return messages;
}
export { storeQOSMessage, getQOSMessage, delQOSMessage, type IQOSMessage };
