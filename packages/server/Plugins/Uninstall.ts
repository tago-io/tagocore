import fs from "node:fs";
import path from "node:path";
import { deactivatePlugin } from "../Services/Plugins.ts";
import { io } from "../Socket/SocketServer.ts";
/**
 * Uninstalls a plugin.
 */
export async function uninstallPlugin(id: string) {
  await deactivatePlugin(id);

  const socketData = {
    id: id,
    deleted: true,
  };

  io?.to(`plugin#${id}`).emit("plugin::sidebar", socketData);
  io?.to(`plugin#${id}`).emit("plugin::status", socketData);
}

/**
 * Uninstalls a plugin.
 */
export async function uninstallPluginByFolder(folder: string) {
  await rmdir(folder);
}

/**
 * Removes directory recursively.
 */
async function rmdir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }

  if (!dir || dir === "/") {
    return;
  }

  const list = await fs.promises.readdir(dir);
  for (let i = 0; i < list.length; i++) {
    const filename = path.join(dir, list[i]);
    const stat = fs.statSync(filename);

    if (filename === "." || filename === "..") {
      // pass these files
    } else if (stat.isDirectory()) {
      // rmdir recursively
      await rmdir(filename);
    } else {
      // rm filename
      await fs.promises.unlink(filename);
    }
  }

  await fs.promises.rmdir(dir);
}
