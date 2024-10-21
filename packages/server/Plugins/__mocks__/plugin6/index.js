import { ServiceModule } from "@tago-io/tcore-sdk";

new ServiceModule({ id: "hello", name: "world" });

setTimeout(() => {
  throw new Error("Invalid database port");
}, 100);
