import type { IUnsubscribePacket } from "mqtt-packet";
import type { ITagoIOClient } from "./onConnect.ts";

async function onUnsubscribe(
  client: ITagoIOClient,
  packet: IUnsubscribePacket & { qos: number },
) {
  client.topics = [
    ...(client.topics || []).filter(
      (x) => !packet.unsubscriptions.some((y) => y === x),
    ),
  ];

  client.suback({ granted: [packet.qos], messageId: packet.messageId });

  // TODO: Log to device inspector
  // for (const unsubscription of packet.unsubscriptions) {
  //   deviceInspector(client.device.id, client.connID, '[MQTT] Device unsubscribe', `topic: ${unsubscription}`);
  // }
}

export default onUnsubscribe;
