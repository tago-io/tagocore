import type { IPluginConfigField } from "@tago-io/tcore-sdk/Types";

const configs: IPluginConfigField[] = [
  {
    type: "group",
    name: "Get Credentials from",
    icon: "key",
    field: "group",
    configs: [
      {
        type: "radio",
        field: "type",
        defaultValue: "config",
        options: [
          {
            label: "From Environment",
            description: "Get the AWS Credentials from environment variables",
            color: "#e15243",
            value: "env",
            icon: "desktop",
            configs: [],
          },
          {
            label: "From Settings",
            description: "Manually set AWS Credentials via this settings page",
            color: "#e15243",
            value: "config",
            icon: "cog",
            configs: [],
          },
        ],
      },
      {
        name: "AWS Access Key ID",
        field: "aws_access_key_id",
        type: "password",
        icon: "key",
        required: true,
        visibility_conditions: [
          { condition: "=", field: "type", value: "config" },
        ],
      },
      {
        name: "AWS Secret Access Key",
        field: "aws_secret_access_key",
        type: "password",
        icon: "key",
        required: true,
        visibility_conditions: [
          { condition: "=", field: "type", value: "config" },
        ],
      },
    ],
  },
  {
    type: "string",
    name: "Queue URL",
    icon: "network-wired",
    tooltip: "URL of the AWS SQS",
    required: true,
    field: "queue_url",
  },
  {
    type: "string",
    name: "Region",
    icon: "globe",
    tooltip: "AWS region",
    defaultValue: "us-east-1",
    placeholder: "us-east-1",
    field: "region",
    required: true,
  },
  {
    type: "number",
    name: "Batch size (per consumer)",
    icon: "bucket",
    tooltip: "Number of messages pooled",
    defaultValue: 10,
    field: "batch_size",
    max: 10,
    min: 1,
    required: true,
  },
  {
    type: "number",
    name: "Number of consumers (per node)",
    icon: "bucket",
    tooltip: "Number of tasks fetching from aws using batch size",
    defaultValue: 1,
    field: "consumers_amount",
    max: 20,
    min: 1,
    required: true,
  },
  {
    type: "number",
    name: "Pooling rate (ms)",
    icon: "clock",
    tooltip: "Time between fetch",
    defaultValue: 0,
    field: "pooling_time_rate",
    min: 0,
  },
];

export { configs };
