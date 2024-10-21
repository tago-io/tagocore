import type { Message } from "@aws-sdk/client-sqs";
import { core } from "@tago-io/tcore-sdk";

async function consumeData(messages: Message[]): Promise<void> {
  const promises = messages.map(async (message) => {
    const deviceID = message?.MessageAttributes?.deviceID?.StringValue;

    if (!message.Body || !deviceID) {
      return;
    }

    const data = JSON.parse(message.Body);

    try {
      return await core.addDeviceData(deviceID, data, { forceDBInsert: true });
    } catch (e) {
      console.error(`ERROR: ${JSON.stringify({ deviceID, error: e })}`);
    }
  });

  await Promise.all(promises);
}

export { consumeData };
