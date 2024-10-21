import type { Server } from "node:http";
import type { TGenericID } from "@tago-io/tcore-sdk/types";
import { type Socket, Server as SocketServer } from "socket.io";
import { getAccountToken } from "../Services/Account/Account.ts";
import { editDevice } from "../Services/Device.ts";
import { checkMasterPassword } from "../index.ts";

/**
 * Socket server instance.
 */
export let io: SocketServer;

/**
 * Validates the token.
 * @returns {boolean} True for valid, false for invalid.
 */
async function validateToken(socket: Socket): Promise<boolean> {
  if (socket.handshake.query.masterPassword) {
    const valid = await checkMasterPassword(
      socket.handshake.query.masterPassword as string,
    );
    return valid;
  }
  if (socket.handshake.query.token) {
    const token = await getAccountToken(
      socket.handshake.query.token as string,
    ).catch(() => null);
    const valid = !!token;
    return valid;
  }

  return false;
}

/**
 * Sets up the socket server.
 */
export async function setupSocketServer(httpServer: Server) {
  io = new SocketServer(httpServer, { cors: { origin: "*" } });

  io.on("connection", async (socket) => {
    const valid = await validateToken(socket);
    if (!valid) {
      socket.disconnect();
      return;
    }

    socket.on("attach", (resourceType: any, resourceID?: TGenericID) => {
      if (resourceType === "install") {
        socket.join("install");
      }
      if (resourceType === "log" && resourceID) {
        socket.join(`log#${resourceID}`);
      }
      if (resourceType === "statistic") {
        socket.join("statistic");
      }
      if (resourceType === "analysis" && resourceID) {
        socket.join(`analysis#${resourceID}`);
      }
      if (resourceType === "module" && resourceID) {
        socket.join(`module#${resourceID}`);
      }
      if (resourceType === "plugin" && resourceID) {
        socket.join(`plugin#${resourceID}`);
      }
      if (resourceType === "device" && resourceID) {
        editDevice(resourceID, { inspected_at: new Date() }).catch(() => false);
        socket.join(`device#${resourceID}`);
      }
    });

    socket.on("unattach", (resourceType: any, resourceID?: string) => {
      if (resourceType === "install") {
        socket.leave("install");
      }
      if (resourceType === "log" && resourceID) {
        socket.leave(`log#${resourceID}`);
      }
      if (resourceType === "statistic") {
        socket.leave("statistic");
      }
      if (resourceType === "analysis") {
        socket.leave(`analysis#${resourceID}`);
      }
      if (resourceType === "module") {
        socket.leave(`module#${resourceID}`);
      }
      if (resourceType === "device") {
        socket.leave(`device#${resourceID}`);
      }
      if (resourceType === "plugin") {
        socket.leave(`plugin#${resourceID}`);
      }
    });

    socket.emit("ready");
  });

  io.on("error", console.error);
}
