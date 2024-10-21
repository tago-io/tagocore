import { ServiceModule } from "@tago-io/tcore-sdk";

const service1 = new ServiceModule({ id: "service1", name: "Service 1" });
service1.onDestroy = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
};
