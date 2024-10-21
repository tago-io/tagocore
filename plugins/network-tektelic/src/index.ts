import type { Server } from "node:http";
import {
  ActionTypeModule,
  PayloadEncoderModule,
  ServiceModule,
} from "@tago-io/tcore-sdk";
import bodyParser from "body-parser";
import express, { type Express } from "express";
import downlinkService from "./Services/downlink.ts";
import downlinkAction from "./Services/downlinkAction.ts";
import tektelicParser from "./Services/tektelicParser.ts";
import uplinkService from "./Services/uplink.ts";
import sendResponse from "./lib/sendResponse.ts";
import type { IConfigParam } from "./types.ts";

const NetworkService = new ServiceModule({
  id: "network-tektelic",
  name: "Tektelic LoRaWAN",
  configs: [
    {
      name: "Port",
      tooltip: "Port used by the Integration to receive connections",
      icon: "cog",
      field: "port",
      type: "number",
      required: true,
      placeholder: "8000",
      defaultValue: 8000,
    },
    {
      name: "Tektelic HTTPS URL",
      tooltip: "Tektelic address",
      icon: "cog",
      field: "url",
      type: "string",
      required: true,
      placeholder: "https://lorawan-ns-na.tektelic.com/",
      defaultValue: "",
    },
    {
      name: "Tektelic HTTPS URL Path",
      tooltip: "HTTPS URL Path provided by Tektelic in the integration",
      icon: "cog",
      field: "url_path",
      type: "string",
      required: true,
      placeholder: "/api/v1/integration/http/xxxxxxxxxxxxxx",
      defaultValue: "",
    },
    {
      name: "Authorization Code",
      tooltip: "Enter an authorization code to be used at Tektelic",
      icon: "cog",
      field: "authorization_code",
      type: "string",
      required: true,
      placeholder: "TagoCore-Auth",
      defaultValue: "TagoCore-Auth",
    },
  ],
});

const encoder = new PayloadEncoderModule({
  id: "network-tektelic-encoder",
  name: "Tektelic LoRaWAN",
});

encoder.onCall = tektelicParser;

const action = new ActionTypeModule({
  id: "tektelic-downlink-trigger",
  name: "Tektelic Downlink-Action",
  option: {
    description: "Send a downlink to a LoRaWAN Tektelic device",
    name: "Downlink to Tektelic Device",
    icon: "$PLUGIN_FOLDER$/assets/downlink.png",
    configs: [
      {
        name: "Port",
        field: "port",
        type: "number",
        tooltip: "Enter the port that the downlink will be send to",
        required: true,
        placeholder: "1",
      },
      {
        name: "Payload (HEX)",
        field: "payload",
        type: "string",
        tooltip:
          "Enter the payload in hexadecimal. You can use keyword $VALUE$ to send to same device of the trigger.",
        required: true,
        defaultValue: "$VALUE$",
      },
      {
        name: "Device ID",
        field: "device",
        type: "string",
        tooltip:
          "Device that will receive the downlink. You can use keyword $DEVICE_ID$ to send to same device of the trigger.",
        required: true,
        defaultValue: "$DEVICE_ID$",
      },
      {
        name: "Confirmed",
        field: "confirmed",
        type: "boolean",
        tooltip: "Send confirmed parameter to the network server",
        defaultValue: false,
      },
    ],
  },
});

let pluginConfig: IConfigParam | undefined;
action.onCall = (...params) =>
  downlinkAction(pluginConfig as IConfigParam, ...params);

let app: Express | undefined;
let server: Server | undefined;
NetworkService.onLoad = async (configParams: IConfigParam) => {
  if (server) {
    await server.close();
  }
  app = express();

  pluginConfig = configParams;
  if (!pluginConfig.port) {
    throw "Port not specified";
  }
  if (!pluginConfig.authorization_code) {
    throw "Authorization code not specified";
  }

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // try {
  //   server = await app.listen(configParams.port, () => {
  //     console.info(`Tektelic-Integration started at port ${configParams.port}`);
  //   });
  // } catch (error) {
  //   console.error(error);
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   throw error as any;
  // }

  const startServer = () => {
    return new Promise((resolve, reject) => {
      if (!app) {
        return reject("Internal error");
      }

      server = app.listen(configParams.port, () => {
        console.info(
          `Tektelic-Integration started at port ${configParams.port}`,
        );
        resolve(true);
      });

      server.on("close", () => reject("Server manually closed"));
      server.on("error", (e) => {
        reject(e);
      });
    });
  };

  await startServer();

  app.get("/", (req, res) =>
    sendResponse(res, {
      body: { status: true, message: "Running" },
      status: 200,
    }),
  );
  app.post("/uplink", (req, res) => uplinkService(configParams, req, res));
  app.post("/downlink", (req, res) => downlinkService(configParams, req, res));
  // app.post("/error", (req, res) => res.send(""));
  app.get("/status", (req, res) =>
    sendResponse(res, {
      body: { status: true, message: "Running" },
      status: 200,
    }),
  );

  app.use((req, res) => res.redirect("/"));
};

NetworkService.onDestroy = async () => {
  if (server) {
    await server.close();
    server = undefined;
  }
};
