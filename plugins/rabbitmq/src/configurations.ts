import type { IPluginConfigField } from "@tago-io/tcore-sdk/Types";

const configs: IPluginConfigField[] = [
  {
    type: "string",
    name: "Host",
    field: "host",
    defaultValue: "localhost",
    icon: "hdd",
    required: true,
  },
  {
    type: "number",
    name: "Port",
    field: "port",
    defaultValue: 5672,
    icon: "network-wired",
    required: true,
  },
  {
    type: "string",
    name: "Queue name",
    field: "queue",
    defaultValue: "tcore-data",
    icon: "envelope",
    required: true,
  },
  {
    type: "string",
    name: "User",
    defaultValue: "root",
    placeholder: "root",
    tooltip: "User name to use for the connection",
    icon: "user-alt",
    field: "user",
    required: true,
  },
  {
    type: "password",
    name: "Password",
    placeholder: "root",
    tooltip: "Optional password for the account used",
    icon: "key",
    field: "password",
  },
  {
    type: "number",
    name: "Batch size (per node)",
    icon: "bucket",
    tooltip: "Max processing messages per node (cluster mode)",
    field: "prefetch",
    min: 0,
    max: 65535,
  },
  {
    type: "number",
    name: "Message time to live (ms)",
    icon: "clock",
    tooltip: "Lifetime of message in ms",
    field: "msg_ttl",
    min: 0,
  },
];

export { configs };
