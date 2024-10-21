import type Connection from "../Services/connections.ts";
import type { ITagoIOClient } from "./onConnect.ts";
import onPublish from "./onPublish.ts";

async function onDisconnect(
  connection: Connection,
  client: ITagoIOClient,
  reason,
) {
  connection.delConnection(client.channel as string, client.connID as string);

  if (!client.disconnected) {
    // TODO: Log to Device Inspector
    // deviceInspector(client.device.id, client.connID, '[MQTT] Device disconnected', `socket event: ${reason}`);
    // TODO: Trigger Action for MQTT Disconnect
    // const actionObj = {
    //   id: client.device.id,
    //   client_id: client.clientId,
    //   connected_at: client.connected_at,
    //   disconnect_at: new Date()
    // };
    // executeAction(client.profile_id, 'device', 'mqtt_disconnect', actionObj, client.device.id);
  }

  // ? Execute Will
  if (reason === "close" && !client.disconnected && client.will) {
    onPublish(connection, client, client.will as any).catch(() => null);
    console.log(
      `Device executed will message [${client.device.id}]`,
      JSON.stringify(client.will),
    );

    // TODO: Log to Device Inspector
    // deviceInspector(client.device.id, client.connID, '[MQTT] Device executed will message', JSON.stringify(client.will));
  }

  if (reason === "disconnect") {
    client.disconnected = true;
  }

  client.destroy();
}

export default onDisconnect;
