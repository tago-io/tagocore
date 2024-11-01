import { runInAction } from "mobx";
import { type Socket, io } from "socket.io-client";
import store from "./Store.ts";

/**
 * the realtime socket.
 */
let socket: Socket | null = null;

/**
 * This function creates the realtime connection to the back-end. The call to this function
 * will set the global variable `socket`, so the socket can also be acquired later using
 * the `getSocket` function.
 *
 * If the global variable socket is already set, this call will be ignored.
 */
function startSocket() {
  if (socket) {
    return;
  }

  const query = { masterPassword: store.masterPassword, token: store.token };
  socket = io("/", { query });

  socket.on("connect", () => {
    runInAction(() => {
      store.socketConnected = true;
    });
  });

  socket.on("disconnect", () => {
    runInAction(() => {
      store.socketConnected = false;
    });
  });
}

/**
 * Returns the previously created socket.io instance.
 * `startSocket` needs to be called first in order for this to not be null.
 * @return {Socket} A Socket.io instance.
 */
function getSocket(): Socket {
  return socket as Socket;
}

export { startSocket, getSocket };
