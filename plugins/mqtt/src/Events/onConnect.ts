import { core, helpers } from "@tago-io/tcore-sdk";
import type mqttCon from "mqtt-connection";
import type { IConnectPacket } from "mqtt-packet";
import ms from "ms";
import type Connection from "../Services/connections.ts";
import mqttChannel from "../Services/mqttChannel.ts";

interface IConfigParam {
  port: number;
  cert?: string;
  username: string;
  password: string;
  connection_method: "device_token" | "client_id" | "certificate";
}

interface ITagoIOClient extends mqttCon.Connection {
  token?: string;
  connID?: string;
  will?: IConnectPacket["will"];
  channel?: string;
  connected_at?: Date;
  topics?: string[];
  clientId?: string;
  payload_type?: string;
  disconnected?: boolean;
}

/**
 * Authenticates the Connection within a Device using Client ID Method.
 * @param client_id string
 * @returns Device
 */
async function clientIDMethod(client_id: string) {
  const device_list = await core.getDeviceList({
    amount: 100,
    page: 1,
    fields: ["id", "name", "tags"],
  });

  if (!device_list || !device_list.length) {
    throw "Authorization Denied: Client ID doesn't match any tag";
  }
  const device = device_list.find((x) =>
    x.tags.find((tag) => tag.value === client_id),
  );

  if (!device) {
    throw "Authorization Denied: Client ID doesn't match any tag";
  }
  return device;
}

/**
 * Authenticates the Connection within a Device using Token Method.
 * @param token string
 * @returns Device
 */
async function deviceTokenMethod(token: string) {
  const device = await core.getDeviceByToken(token);
  if (!device) {
    throw `Authorization Denied: Token not found ${token}`;
  }

  return device;
}

async function onConnect(
  stream,
  connection: Connection,
  client: ITagoIOClient,
  packet: IConnectPacket,
  configParams: IConfigParam,
) {
  const keepalive = ms(`${packet.keepalive} sec`) || ms("1 min"); // ? DEFAULT SHOULD BE 1 MIN!!
  stream.setTimeout(keepalive * 2);

  if (!packet.username || !packet.password) {
    throw "Missing username/password credentials";
  }

  let deviceResult: any;
  const password = packet.password?.toString();

  if (configParams.connection_method === "client_id") {
    if (configParams.username.toLowerCase() !== packet.username.toLowerCase()) {
      throw "Invalid username/password credentials";
    }
    if (configParams.password !== password) {
      throw "Invalid username/password credentials";
    }
    deviceResult = await clientIDMethod(packet.clientId);
  } else if (configParams.connection_method === "device_token") {
    deviceResult = await deviceTokenMethod(password);
    client.token = password;
  } else {
    throw "Not implemented";
  }

  client.connID = helpers.generateResourceID();
  client.clientId = packet.clientId;
  client.device = deviceResult;
  client.will = packet.will;
  client.topics = [];
  client.connected_at = new Date();

  client.channel = mqttChannel(client.device.id);

  const payload_list = await core.getDeviceParamList(deviceResult.id);
  client.payload_type =
    payload_list.find((param) => param.key === "payload_type")?.value || "auto";

  connection.addConnection(client.channel, client);

  console.debug(`Device connected [${client.device.id}]`);
  // TODO: ADD Live Inspector support.
  // deviceInspector(client.device.id, client.connID, '[MQTT] Device connected', `Token Ending: ${String(tokenResult.tokenObj.token).slice(-5)} Client-ID: ${packet.clientId} Will-Message: ${!!client.will}`);

  client.connack({ returnCode: 0, reasonCode: 0 });

  // const actionObj = {
  //   id: client.device.id,
  //   client_id: client.clientId,
  //   connected_at: client.connected_at,
  // };
  // executeAction(client.profile_id, 'device', 'mqtt_connect', actionObj, client.device.id);
}

export type { IConfigParam, ITagoIOClient };
export default onConnect;
