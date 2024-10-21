import { ServiceModule } from "@tago-io/tcore-sdk";

const service1 = new ServiceModule({ id: "service1", name: "Service 1" });
service1.onLoad = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2500);
  });
};

const service2 = new ServiceModule({ id: "service2", name: "Service 2" });
service2.onLoad = () => {
  return new Promise((resolve, reject) => {
    reject("Error in service2");
  });
};
