
import type { SystemModule } from "@tago-io/tcore-sdk";
import type { Server } from "socket.io";
import type { Socket } from "socket.io-client";

interface ICommandQueueItem {
  type:
    | "install"
    | "settings"
    | "uninstall"
    | "disable"
    | "enable"
    | "startModule"
    | "stopModule"
    | "setMasterPassword"
    | "factoryReset"
    | "setDatabasePlugin";
  promise: {
    resolve: Function;
    reject: Function;
  };
}

interface IStateQueueItem {
  connID: string;
  state: string;
  options?: {
    rollback?: boolean;
    firstSync?: boolean;
    error?: string;
  };
}

interface IObjects {
  tcore: any;
  socket: Socket<any> | null;
  serverIO: Server | null;
  commandsQueue: ICommandQueueItem[];
  stateQueue: IStateQueueItem[];
  systemModule: SystemModule | null;
  attachedDevices: Array<string>;
}

const cache: IObjects = {
  tcore: null,
  socket: null,
  serverIO: null,
  commandsQueue: [],
  stateQueue: [],
  systemModule: null,
  attachedDevices: [],
};

export { cache };
