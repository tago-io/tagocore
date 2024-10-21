import { ActionTypeModule, ServiceModule } from "@tago-io/tcore-sdk";
import nodeREDAction from "./Services/nodeREDAction.ts";
import type { IConfigParam } from "./types.ts";

const NetworkService = new ServiceModule({
  id: "network-nodered",
  name: "Node-RED",
  configs: [
    {
      name: "Node-RED URL",
      tooltip: "The URL where the Node-RED server is running",
      icon: "cog",
      field: "url",
      type: "string",
      required: true,
      placeholder: "http://localhost:1880",
      defaultValue: "http://localhost:1880",
    },
    {
      name: "Username",
      tooltip: "Username from Node-RED (optional)",
      icon: "cog",
      field: "username",
      type: "string",
      required: false,
      placeholder: "enter an username from Node-RED",
      defaultValue: "admin",
    },
    {
      name: "Password",
      tooltip: "Password from Node-RED (optional)",
      icon: "cog",
      field: "password",
      type: "password",
      required: false,
      placeholder: "enter a password from Node-RED",
      defaultValue:
        "$2a$08$zZWtXTja0fB1pzD4sHCMyOCMYz2Z6dNbM6tl8sJogENOMcxWV9DN.",
    },
  ],
});

const action = new ActionTypeModule({
  id: "nodered-downlink-trigger",
  name: "Send data to Node-RED",
  option: {
    description: "Send a group of data to your Node-RED integration",
    name: "Send data to Node-RED",
    // @ts-ignore
    icon: "$PLUGIN_FOLDER$/assets/downlink.png",
    configs: [
      {
        name: "Endpoint",
        field: "endpoint",
        type: "string",
        tooltip: "Enter the endpoint from Node-RED",
        required: true,
        placeholder: "/data",
      },
    ],
  },
});

let pluginConfig: IConfigParam | undefined;
action.onCall = (...params) =>
  nodeREDAction(pluginConfig as IConfigParam, ...params);

NetworkService.onLoad = async (configParams: IConfigParam) => {
  pluginConfig = configParams;
};

NetworkService.onDestroy = async () => {};
