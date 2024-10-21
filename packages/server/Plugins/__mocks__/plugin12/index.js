import { ServiceModule } from "@tago-io/tcore-sdk";

const service = new ServiceModule({ id: "service1", name: "Service 1" });

service.showMessage("info", "Hello world");
