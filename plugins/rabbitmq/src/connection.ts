import type { QueueModule } from "@tago-io/tcore-sdk";
import type { IDatabaseDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import amqplib, { type Channel } from "amqplib";
import { consumeData } from "./consume-data.ts";
import type { Config } from "./types.ts";

let consumer: Channel;
let sender: Channel;
let info: Channel;
let queue = "tcore-data";
let ttl: number;

async function createConnection(this: QueueModule, config: Config) {
  const connection = await amqplib.connect({
    protocol: "amqp",
    hostname: config.host,
    port: config.port,
    username: config.user,
    password: config.password,
  });

  queue = config.queue;

  if (config.msg_ttl !== undefined) {
    ttl = config.msg_ttl;
  }

  consumer = await connection.createChannel();
  info = await connection.createChannel();
  sender = await connection.createChannel();

  if (config.prefetch !== undefined) {
    consumer.prefetch(config.prefetch);
  }

  await consumer.assertQueue(queue, { durable: true });

  consumer.consume(queue, consumeData);

  setInterval(async () => {
    const res = await info.assertQueue(queue, { durable: true });

    this.showMessage("info", `Queue running! Length: ${res.messageCount}`);
  }, 1000);
}

// eslint-disable-next-line no-unused-vars
async function closeConnection(this: QueueModule) {
  this.showMessage("info", "Closing connection");

  consumer.close();
  sender.close();
  info.close();
}

async function addToQueue(deviceID: string, data: IDatabaseDeviceDataCreate[]) {
  sender.sendToQueue(queue, Buffer.from(JSON.stringify(data), "utf-8"), {
    contentType: "application/json",
    messageId: deviceID,
    expiration: ttl,
  });
}

export {
  consumer,
  sender,
  info,
  createConnection,
  closeConnection,
  addToQueue,
};
