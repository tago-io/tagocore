import net from "node:net";
import {
  ActionTriggerModule,
  ActionTypeModule,
  ServiceModule,
  core,
  helpers,
} from "@tago-io/tcore-sdk";
import queue from "async/queue.js";
import mqttCon from "mqtt-connection";
import ms from "ms";
import onConnect, { type IConfigParam } from "./Events/onConnect.ts";
import onDisconnect from "./Events/onDisconnect.ts";
import onPublish from "./Events/onPublish.ts";
import onSubscribe from "./Events/onSubscribe.ts";
import onUnsubscribe from "./Events/onUnsubscribe.ts";
import Connection from "./Services/connections.ts";
import digestMessages from "./Services/digestMessages.ts";
import { delQOSMessage } from "./Services/mqtt.qos";
import { retainMQTT } from "./Services/mqtt.retained";
import mqttChannel from "./Services/mqttChannel.ts";

const connection = new Connection();

const MQTTActionByVariable = new ActionTypeModule({
  id: "mqtt-action-send",
  name: "MQTT ActionType-Publish",
  option: {
    description: "Publish something to MQTT whenever this action is triggered",
    icon: "$PLUGIN_FOLDER$/assets/icon.png",
    name: "Publish to MQTT",
    configs: [
      {
        name: "Device ID",
        field: "device_id",
        type: "string",
        tooltip: "Device ID which will receive the publish",
        required: true,
      },
      {
        name: "Quality of Service",
        field: "qos",
        tooltip:
          "Specify the quality of service that will be used in the requests",
        options: [
          { label: "QoS 0", value: "qos-0" },
          { label: "QoS 1", value: "qos-1" },
          { label: "QoS 2", value: "qos-2" },
        ],
        type: "option",
      },
      {
        name: "Uplink Topic",
        field: "uplink_topic",
        type: "string",
        required: true,
      },
      {
        name: "Payload",
        field: "payload",
        type: "string",
      },
      {
        name: "Retain",
        field: "retain",
        type: "boolean",
      },
    ],
  },
});

MQTTActionByVariable.onCall = async (action_id, action_settings, data_list) => {
  const action = await core.getActionInfo(action_id);
  const variables = action.trigger.conditions.map(
    (condition) => condition.variable,
  );

  const data = data_list.find((data) => variables?.includes?.(data?.variable));
  if (!data?.origin) {
    return console.error(
      `Action MQTT Publish doesn't support triggers that is not by Variable`,
    );
  }
  if (!action_settings.uplink_topic) {
    return console.error(
      "Action MQTT ignored, because uplink topic was not defined",
    );
  }
  if (!action_settings.device_id) {
    return console.error(
      "Action MQTT ignored, because device id was not defined",
    );
  }

  const deviceInfo = await core.getDeviceInfo(data?.origin);
  const targetDevice = await core
    .getDeviceInfo(action_settings.device_id)
    .catch(() => null);
  if (!targetDevice) {
    return console.error(
      `Device ID is invalid or doesn't exist: ${action_settings.device_id}`,
    );
  }

  const channel = mqttChannel(deviceInfo?.id);
  const qos = Number(action_settings.qos.split("-").pop());
  const messageId = helpers.generateResourceID();

  // Replace keys in the payload message
  let payload = action_settings.payload
    .replace(/\$VALUE\$/g, data?.value || "")
    .replace(/\$VARIABLE\$/g, data?.variable)
    .replace(/\$DEVICE\.NAME\$/g, deviceInfo?.name)
    .replace(/\$DEVICE\$/g, data?.origin)
    .replace(/\$UNIT\$/g, data?.unit || "");

  if (data?.location) {
    const location_string = `${data?.location?.coordinates?.latitude},${data?.location?.coordinates?.longitude}`;
    payload = payload.replace(/\$LOCATION\$/g, location_string);
  }

  if (action_settings.retain) {
    retainMQTT({
      topic: action_settings.uplink_topic,
      qos,
      messageId,
      payload,
      device: targetDevice.id,
    });
  }

  digestMessages(connection, channel, {
    topic: action_settings.uplink_topic,
    qos,
    messageId,
    payload,
  });
};

const MQTTStoreToBucket = new ActionTypeModule({
  id: "mqtt-action-store",
  name: "MQTT ActionType-Store Data",
  option: {
    description: "Split and store data to the device bucket.",
    icon: "$PLUGIN_FOLDER$/assets/icon.png",
    name: "Store data in the Device Bucket",
    configs: [],
  },
});

MQTTStoreToBucket.onCall = async (action_id, value, data) => {
  let dataTriggered: any;
  try {
    dataTriggered = JSON.parse(data.payload);
    if (Array.isArray(dataTriggered)) {
      for (const item of dataTriggered) {
        if (item) {
          item.metadata = { ...item.metadata, mqtt_topic: data.topic };
        }
      }
    } else if (dataTriggered) {
      dataTriggered.metadata = {
        ...dataTriggered.metadata,
        mqtt_topic: data.topic,
      };
    }
  } catch (e) {
    // ignore
  }

  dataTriggered = dataTriggered
    ? dataTriggered
    : {
        variable: "payload",
        value: data.payload,
        metadata: {
          topic: data.topic,
        },
      };

  core.addDeviceData(data.device, dataTriggered);
};

new ActionTriggerModule({
  id: "mqtt-action-trigger",
  name: "MQTT Action-Trigger",
  option: {
    description: "Triggered based on MQTT topic.",
    name: "MQTT Trigger",
    configs: [
      {
        description:
          "if data arrives in one of these topics, the Action will be triggered.",
        field: "topic",
        icon: "hashtag",
        name: "Topic",
        placeholder: "You may use wildcards (home/+/temperature)",
        required: true,
        title: "Topic Subscription",
        type: "string-list",
      },
    ],
  },
});

const MQTTService = new ServiceModule({
  id: "mqtt-service",
  name: "MQTT Service",
  configs: [
    {
      name: "Connection method",
      field: "connection_method",
      type: "option",
      tooltip: "Authorization method used to connect to the MQTT Broker",
      icon: "cog",
      options: [
        { label: "Connect using device-token", value: "device_token" },
        {
          label: "Connect using username, password and Client ID",
          value: "client_id",
        },
        // { label: "Use certificate", value: "certificate" },
      ],
    },
    {
      type: "row",
      visibility_conditions: [
        {
          condition: "=",
          field: "connection_method",
          value: "client_id",
        },
      ],
      configs: [
        {
          name: "Username",
          tooltip:
            "Username to be used in the MQTT Broker if 'Connection Method' is set to 'Connect using username, password and Client ID'",
          icon: "user-alt",
          field: "username",
          type: "string",
          placeholder: "Enter the username",
          required: true,
          defaultValue: "admin",
        },
        {
          name: "Password",
          tooltip:
            "Password to be used in the MQTT Broker if 'Connection Method' is set to 'Connect using username, password and Client ID'",
          icon: "eye",
          field: "password",
          type: "password",
          placeholder: "Enter the password",
          required: true,
        },
      ],
    },
    {
      name: "Port",
      tooltip: "Port used by the MQTT Broker to receive connections",
      icon: "cog",
      field: "port",
      type: "number",
      required: true,
      placeholder: "1883",
      defaultValue: 1883,
    },

    // TODO: Add CA signed Certificate
    // { name: "Certificate", field: "cert", type: "file" },
  ],
});

const debug = (e) => {
  console.error(e);

  return Promise.resolve();
};

const requestDenied = new Set();
setInterval(() => {
  requestDenied.clear();
}, 600000);

function initConnection(stream, configParams: IConfigParam) {
  const client = mqttCon(stream);

  client.on("connect", (packet) => {
    onConnect(stream, connection, client, packet, configParams).catch(
      (error) => {
        if (packet) {
          const password = `-hidden-${String(packet.password).slice(-5)}`;
          const objDebug = {
            error,
            clientId: String(packet.clientId || ""),
            username: String(packet.username || ""),
            password: packet.password ? password : "",
          };
          const hash = JSON.stringify(objDebug);

          if (!requestDenied.has(hash)) {
            requestDenied.add(hash);
          }
        }

        client.connack({ returnCode: 5, reasonCode: 134 });
        client.destroy();
      },
    );
  });

  client.on("disconnect", () =>
    onDisconnect(connection, client, "disconnect").catch(debug),
  );
  client.on("close", () =>
    onDisconnect(connection, client, "close").catch(debug),
  );
  client.on("error", () =>
    onDisconnect(connection, client, "error").catch(debug),
  );

  client.on("publish", (packet) =>
    onPublish(connection, client, packet).catch(debug),
  );
  client.on("subscribe", (packet) => onSubscribe(client, packet).catch(debug));
  client.on("unsubscribe", (packet) =>
    onUnsubscribe(client, packet).catch(debug),
  );

  client.on("pingreq", () => {
    try {
      client.pingresp();
    } catch (e) {
      debug(e);
    }
  });

  client.on("pubrel", (packet) => {
    try {
      client.pubcomp(packet);
    } catch (e) {
      debug(e);
    }
  });

  client.on("pubrec", (packet) => {
    try {
      client.pubrel(packet);
    } catch (e) {
      debug(e);
    }
  });

  client.on("puback", (packet) => {
    if (!packet.messageId) return;

    try {
      delQOSMessage(client.device.id, packet.topic, packet.messageId as any);
    } catch (e) {
      debug(e);
    }
  });

  stream.on("timeout", () => {
    try {
      client.destroy();
    } catch (e) {
      debug(e);
    }
  });

  if (stream.setTimeout) {
    stream.setTimeout(ms("1 min")); // ? DEFAULT SHOULD BE 1 MIN!!
  }
}

let server: net.Server | undefined;
MQTTService.onLoad = async (configParams: IConfigParam) => {
  if (server) {
    await connection.restart();
    server.close();
    server.unref();
    server = undefined;
  }

  if (!configParams.connection_method) {
    throw new Error("You must select a connection method");
  }

  if (configParams.connection_method === "client_id") {
    if (!configParams.username) {
      throw new Error("You must enter a username");
    }

    if (!configParams.password) {
      throw new Error("You must enter a password");
    }
  }

  if (!configParams.port) {
    throw new Error("You must setup a port in the MQTT settings");
  }

  if (!configParams.cert) {
    console.info("Setting up MQTT without certificate");
  }

  const queueConnections = queue(({ stream }, callback) => {
    initConnection(stream, configParams);
    setTimeout(callback, 1000);
  }, 100);

  const startServer = () =>
    new Promise((resolve, reject) => {
      server = new net.Server();
      server.on("connection", (stream) => {
        queueConnections.push({ stream });
      });

      server.on("close", () => reject("Server manually closed"));
      server.on("error", (e) => {
        console.error(e);
        return reject(e);
      });

      server.listen(Number(configParams.port), () => {
        console.info(`Port=${configParams.port} Service=MQTT`);
        resolve(true);
      });
    });
  await startServer();
};

MQTTService.onDestroy = async () => console.log("stopped");
