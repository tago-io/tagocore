import type {
  IDevice,
  ILiveInspectorMessageCreate,
  TGenericID,
  TLiveInspectorConnectionID,
} from "@tago-io/tcore-sdk/types";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";
import { plugins } from "../Plugins/Host.ts";
import { io } from "../Socket/SocketServer.ts";
import { getDeviceInfo } from "./Device.ts";

/**
 */
export function canLiveInspectorBeActivated(device: IDevice): boolean {
  const { inspected_at } = device;
  if (
    inspected_at &&
    DateTime.fromJSDate(new Date(inspected_at)) >=
      DateTime.utc().minus({ minute: 1 })
  ) {
    return true;
  }
  return false;
}

/**
 * Gets the live inspector connection ID based on the time when the device was last inspected.
 * If the last inspection date was too long ago, a `null` connection id will be returned.
 */
export function getLiveInspectorID(
  device: IDevice,
): TLiveInspectorConnectionID {
  return canLiveInspectorBeActivated(device) ? nanoid(10) : null;
}

/**
 * Emits one or more messages to the live inspector of a device.
 */
export const emitToLiveInspector = async (
  device: IDevice,
  msg: ILiveInspectorMessageCreate | ILiveInspectorMessageCreate[],
  liveInspectorID?: TLiveInspectorConnectionID,
) => {
  const connectionID = liveInspectorID || getLiveInspectorID(device);
  if (!connectionID) {
    // no one is watching the device's live inspector
    return;
  }

  const data = [msg].flat().map((x, i) => ({
    connection_id: connectionID,
    content:
      typeof x.content === "object" ? JSON.stringify(x.content) : x.content,
    device_id: device.id,
    timestamp: new Date(Date.now() + i),
    title: x.title,
  }));

  io?.to(`device#${device.id}`).emit("device::inspection", data);
};

/**
 * Emits one or more messages to the live inspector of a via a plugin call.
 * This should only be used actual plugins, and not the api.
 */
export async function emitToLiveInspectorViaPlugin(
  pluginID: TGenericID,
  deviceID: TGenericID,
  msg: ILiveInspectorMessageCreate | ILiveInspectorMessageCreate[],
  liveInspectorID?: TLiveInspectorConnectionID,
) {
  const device = await getDeviceInfo(deviceID);
  const pluginName = plugins.get(pluginID)?.tcoreName;
  if (pluginName && canLiveInspectorBeActivated(device)) {
    const data = [msg]
      .flat()
      .map((x) => ({ ...x, title: `[Plugin ${pluginName}] ${x.title}` }));
    emitToLiveInspector(device, data, liveInspectorID);
  }
}
