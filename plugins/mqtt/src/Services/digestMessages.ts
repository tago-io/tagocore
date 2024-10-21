import channelRegex from "../Utils/channelRegex.ts";
import type Connection from "./connections.ts";

interface Scope {
  topic: string;
  payload: string;
  qos: number;
  messageId?: string;
  drop_connection?: boolean;
}

function digestMessages(connection: Connection, channel: string, scope: Scope) {
  const connections = connection.getConnections(channel);
  if (!connections.length) {
    return;
  }

  const { topic, payload, qos, messageId, drop_connection } = scope as any;

  for (const client of connections) {
    // ? disconnect by device id or token
    if (
      drop_connection === client.device.id ||
      (client.token && client.token === drop_connection)
    ) {
      client.connack({ returnCode: 5 });
      return client.destroy();
    }

    const scopeMQTT: Omit<Scope, "drop_connection" | "payload"> & {
      payload: Buffer | string;
    } = {
      topic,
      payload,
      qos,
      messageId: qos ? messageId : undefined,
    };

    if (client.payload_type === "hex") {
      scopeMQTT.payload = Buffer.from(String(scopeMQTT.payload), "hex");
    }

    if (client.topics) {
      for (const clientTopic of client.topics || []) {
        if (channelRegex(clientTopic).test(topic)) {
          // deviceProvider.updateLastTime(client.device.id, 'output');
          client.publish(scopeMQTT, (e) => e && console.error(e));
        }
      }
    }
  }
}

export default digestMessages;
