import { logBuffer } from "../Helpers/log.ts";
import { plugins } from "../Plugins/Host.ts";

/**
 * Retrieves all the logs of a single channel.
 */
export async function getLogChannelInfo(id: string) {
  const logs = logBuffer.get(id) || [];
  return logs;
}

/**
 * Lists all the log channels.
 */
export async function getLogChannelList(): Promise<any> {
  const channels = [
    {
      name: "Application",
      channel: "api",
      plugin: false,
    },
  ];

  for (const plugin of plugins.values()) {
    channels.push({
      name: `Plugin:${plugin.tcoreName}`,
      channel: `plugin:${plugin.id}`,
      plugin: true,
    });
  }

  return channels;
}
