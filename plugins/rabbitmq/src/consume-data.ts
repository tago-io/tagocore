import { core } from "@tago-io/tcore-sdk";
import type { ConsumeMessage } from "amqplib";
import { consumer } from "./connection.ts";

function consumeData(msg: ConsumeMessage | null): void {
  if (msg === null) {
    console.error("Consumer cancelled by server");
    return;
  }

  let deviceID: string;
  let data: any;

  try {
    data = JSON.parse(msg.content.toString());
    deviceID = msg.properties.messageId;
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    consumer.reject(msg, false);
    return;
  }

  core
    .addDeviceData(deviceID, data, { forceDBInsert: true })
    .then(() => {
      consumer.ack(msg);
    })
    .catch((e) => {
      console.error(
        `ERROR: ${JSON.stringify({ deviceID, data, error: e?.message | e })}`,
      );

      return consumer.reject(msg, false);
    });
}

export { consumeData };
