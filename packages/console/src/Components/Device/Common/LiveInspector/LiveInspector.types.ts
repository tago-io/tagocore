import type { ILiveInspectorMessage } from "@tago-io/tcore-sdk/types";

export interface IInspectorData {
  enabled: boolean;
  limit: number;
  logs: {
    [key: string]: ILiveInspectorMessage[];
  };
}
