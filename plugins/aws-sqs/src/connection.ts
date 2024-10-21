import {
  GetQueueAttributesCommand,
  SQSClient,
  type SQSClientConfig,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { Consumer } from "@rxfork/sqs-consumer";
import type { QueueModule } from "@tago-io/tcore-sdk";
import type { IDatabaseDeviceDataCreate } from "@tago-io/tcore-sdk/Types";
import { consumeData } from "./consume-data.ts";
import type { Config } from "./types.ts";

let client: SQSClient;

let QueueUrl: string;
let consumers: Consumer[] = [];

async function createConnection(this: QueueModule, config: Config) {
  const clientConfig: SQSClientConfig = {
    apiVersion: "2012-11-05",
    region: config.region,
    credentials:
      config.type === "config"
        ? {
            accessKeyId:
              config.aws_access_key_id || process.env.AWS_ACCESS_KEY_ID || "",
            secretAccessKey:
              config.aws_secret_access_key ||
              process.env.AWS_SECRET_ACCESS_KEY ||
              "",
          }
        : undefined,
  };

  client = new SQSClient(clientConfig);

  QueueUrl = config.queue_url;

  const start = async () => {
    const consumer = Consumer.create({
      queueUrl: QueueUrl,
      sqs: client,
      batchSize: config.batch_size,
      pollingWaitTimeMs: config.pooling_time_rate ?? 0,
      messageAttributeNames: ["deviceID"],
      handleMessage: (message) => consumeData([message]),
      handleMessageBatch: consumeData,
    });
    consumer.start();

    return consumer;
  };

  const consumerPromises: Promise<Consumer>[] = [];

  for (let i = 0; i < config.consumers_amount ?? 1; i++) {
    consumerPromises.push(start());
  }

  consumers = await Promise.all(consumerPromises);

  setInterval(async () => {
    const attributesCommand = new GetQueueAttributesCommand({
      QueueUrl,
      AttributeNames: ["ApproximateNumberOfMessages"],
    });
    const result = await client.send(attributesCommand);

    this.showMessage(
      "info",
      `Queue running! Messages on queue ≈ ${result?.Attributes?.ApproximateNumberOfMessages}`,
    );
  }, 5000);
}

async function closeConnection(this: QueueModule) {
  this.showMessage("info", "Closing connection");

  client.destroy();
  consumers.forEach((consumer) => consumer.stop());
}

async function addToQueue(deviceID: string, data: IDatabaseDeviceDataCreate[]) {
  const command = new SendMessageCommand({
    MessageBody: JSON.stringify(data),
    QueueUrl,
    MessageAttributes: {
      deviceID: {
        DataType: "String",
        StringValue: deviceID,
      },
    },
  });

  await client.send(command);
}

export { createConnection, closeConnection, addToQueue };
