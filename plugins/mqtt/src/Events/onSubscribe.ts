import type { ISubscribePacket } from "mqtt-packet";
import { getQOSMessage } from "../Services/mqtt.qos";
import { getRetainedMQTT } from "../Services/mqtt.retained";
import type { ITagoIOClient } from "./onConnect.ts";

async function onSubscribe(client: ITagoIOClient, packet: ISubscribePacket) {
  const qosGranted = packet.subscriptions.map((x) => x.qos);

  client.suback({ messageId: packet.messageId, granted: qosGranted });

  for (const subscription of packet.subscriptions) {
    client.topics = [...(client.topics || []), subscription.topic];

    // Send Retained messages
    const retainedMsg = await getRetainedMQTT(
      client.device.id,
      subscription.topic,
    );
    if (retainedMsg) {
      const dataMQTT = {
        topic: retainedMsg.topic,
        payload: retainedMsg.payload,
        qos: retainedMsg.qos,
        messageId: retainedMsg.qos ? retainedMsg.messageId : undefined,
      };

      client.publish(dataMQTT);
    }

    // Send QOS 2 and 3 messages
    const qosList = await getQOSMessage(client.device.id, subscription.topic);
    if (qosList?.length) {
      for (const qosMsg of qosList) {
        const dataMQTT = {
          topic: qosMsg.topic,
          payload: qosMsg.payload,
          qos: qosMsg.qos,
          messageId: qosMsg.qos ? qosMsg.messageId : undefined,
        };

        client.publish(dataMQTT);
      }
    }

    // TODO: Log to device inspector
    // deviceInspector(client.device.id, client.connID, '[MQTT] Device subscribe', `topic: ${subscription.topic}`);
  }
}

export default onSubscribe;
