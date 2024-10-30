
import type { SystemModule } from "@tago-io/tcore-sdk";
import type { Server } from "socket.io";

interface ICommandQueueItem {
  type: "install" | "settings" | "uninstall" | "disable" | "enable" | "startModule" | "stopModule" | "setMasterPassword" | "factoryReset" | "setDatabasePlugin";
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
  serverIO: Server | null;
  commandsQueue: ICommandQueueItem[];
  stateQueue: IStateQueueItem[];
  systemModule: SystemModule | null;
  attachedDevices: Array<string>;
  events: any;
}

const cache: IObjects = {
  tcore: null,
  serverIO: null,
  commandsQueue: [],
  stateQueue: [],
  systemModule: null,
  attachedDevices: [],
  events: null,
};

export { cache };
