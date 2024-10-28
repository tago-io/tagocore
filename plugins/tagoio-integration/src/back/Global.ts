import type { SystemModule } from "@tago-io/tcore-sdk";
import type EventSource from "eventsource";


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
  realtimeConnection: EventSource | null;
  commandsQueue: ICommandQueueItem[];
  stateQueue: IStateQueueItem[];
  systemModule: SystemModule | null;
}

const cache: IObjects = {
  tcore: null,
  realtimeConnection: null,
  commandsQueue: [],
  stateQueue: [],
  systemModule: null,
};

export { cache };
