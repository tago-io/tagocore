import { ServiceModule } from "@tago-io/tcore-sdk";

const service = new ServiceModule({ id: "hello", name: "world" });

service.onLoad = async () => {
  throw new Error("Invalid database port");
};
