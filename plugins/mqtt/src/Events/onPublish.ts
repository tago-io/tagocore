import { core } from "@tago-io/tcore-sdk";
import type { IPublishPacket } from "mqtt-packet";
import type Connection from "../Services/connections.ts";
import digestMessages from "../Services/digestMessages.ts";
import { storeQOSMessage } from "../Services/mqtt.qos";
import { retainMQTT } from "../Services/mqtt.retained";
import channelRegex from "../Utils/channelRegex.ts";
import type { ITagoIOClient } from "./onConnect.ts";

function generateID() {
  const number = String(new Date().getTime());
  return Number(number.slice(-4));
}

type PublishPacket = Omit<IPublishPacket, "messageId"> & { messageId?: string };
async function onPublish(
  connection: Connection,
  client: ITagoIOClient,
  packet: PublishPacket,
) {
  if (!client.channel) {
    return client.destroy();
  }

  if (packet.qos === 1) {
    client.puback(packet);
  } else if (packet.qos === 2) {
    client.pubrec(packet);
  }

  let payload: any;

  if (client.payload_type === "hex") {
    payload = Buffer.isBuffer(packet.payload)
      ? packet.payload.toString("hex")
      : String(packet.payload);
  } else {
    payload = String(packet.payload);
  }

  const scope: {
    topic: string;
    payload: any;
    qos: number;
    messageId?: string;
  } = {
    topic: packet.topic,
    payload,
    qos: packet.qos,
  };

  let actionList = await core.getActionList({
    amount: 9999,
    fields: ["trigger", "action", "type"],
  });
  actionList = actionList.filter((action) =>
    action?.type?.includes?.("mqtt-action-trigger"),
  );

  const canTrigger = (topics) =>
    Array.isArray(topics) &&
    topics.find((topic) => channelRegex(topic).test(scope.topic));
  for (const action of actionList) {
    if (canTrigger(action.trigger?.topic)) {
      await core.triggerAction(action.id, {
        ...scope,
        device: client.device.id,
      });
    }
  }
  const messageId = String(generateID());

  if (packet.qos) {
    await storeQOSMessage(client.device.id, {
      ...scope,
      messageId,
    });
  }

  if (packet.retain) {
    await retainMQTT({
      ...scope,
      device: client.device.id,
      messageId,
    });
  }

  digestMessages(connection, client.channel, {
    payload,
    qos: scope.qos,
    topic: scope.topic,
    drop_connection: false,
    messageId,
  });

  // TODO: Log to device inspector
  // deviceInspector(client.device.id, client.connID, '[MQTT] Device publish', JSON.stringify(scope));

  // TODO: Update Device Last Input
  // deviceProvider.updateLastTime(client.device.id, 'input');
}

export default onPublish;
