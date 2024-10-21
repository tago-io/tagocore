import { QueueModule } from "@tago-io/tcore-sdk";
import { configs } from "./configurations.ts";
import { addToQueue, closeConnection, createConnection } from "./connection.ts";

const rabbitMQ = new QueueModule({
  id: "rabbit-mq",
  name: "RabbitMQ",
  configs,
});

rabbitMQ.onLoad = createConnection;
rabbitMQ.onDestroy = closeConnection;
rabbitMQ.onAddDeviceData = addToQueue;

export default rabbitMQ;
