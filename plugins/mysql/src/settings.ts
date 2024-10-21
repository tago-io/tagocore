import type {
  IModuleSetupWithoutType,
  IPluginConfigField,
} from "@tago-io/tcore-sdk/types";

type Configs = IModuleSetupWithoutType["configs"];

const div: IPluginConfigField = {
  type: "divisor",
};

function connection(prefix: string) {
  const connectionMenu: IPluginConfigField = {
    field: `${prefix}_connection`,
    type: "radio",
    defaultValue: "single",
    options: [
      {
        color: "#337ab7",
        label: "Single connection",
        value: "single",
        icon: "database",
        description:
          "Use a single connection to read and write to the database",
        configs: [
          div,
          {
            type: "row",
            configs: [
              {
                type: "string",
                field: `${prefix}_read_host`,
                placeholder: "localhost",
                defaultValue: "localhost",
                tooltip: "The host name or IP address of the MySQL server",
                name: "Host",
                icon: "hdd",
                required: true,
              },
              {
                type: "number",
                field: `${prefix}_read_port`,
                placeholder: "3306",
                defaultValue: 3306,
                tooltip:
                  "The TCP/IP port on which the MySQL server is listening (the default is 3306)",
                name: "Port",
                icon: "network-wired",
                required: true,
              },
            ],
          },
        ],
      },
      {
        color: "#9851a4",
        label: "Read/Write connection",
        value: "read_write",
        icon: "database-double",
        description:
          "Use a connection to read and another connection to write to the database",
        configs: [
          div,
          {
            type: "row",
            configs: [
              {
                type: "string",
                field: `${prefix}_read_host`,
                placeholder: "localhost",
                defaultValue: "localhost",
                tooltip:
                  "The host name or IP address of the read instance of the MySQL server",
                name: "Read host",
                icon: "hdd",
                required: true,
              },
              {
                type: "number",
                field: `${prefix}_read_port`,
                tooltip:
                  "The TCP/IP port on which the read instance of the MySQL server is listening (the default is 3306)",
                placeholder: "3306",
                defaultValue: 3306,
                name: "Port",
                icon: "network-wired",
                required: true,
              },
            ],
          },
          {
            type: "row",
            configs: [
              {
                type: "string",
                field: `${prefix}_write_host`,
                placeholder: "localhost",
                defaultValue: "localhost",
                tooltip:
                  "The host name or IP address of the write instance of the MySQL server",
                name: "Write host",
                icon: "hdd",
              },
              {
                type: "number",
                field: `${prefix}_write_port`,
                tooltip:
                  "The TCP/IP port on which the write instance of the MySQL server is listening (the default is 3306)",
                placeholder: "3306",
                defaultValue: 3306,
                name: "Port",
                icon: "network-wired",
              },
            ],
          },
        ],
      },
    ],
  };

  return connectionMenu;
}

function pool(prefix: string): IPluginConfigField[] {
  return [
    {
      type: "row",
      configs: [
        {
          type: "number",
          name: "Min connections pool",
          min: 1,
          defaultValue: 1,
          placeholder: "1",
          icon: "caret-down",
          field: `${prefix}_min_pool`,
          tooltip: "Minimum amount of connection to pool in memory",
          required: true,
        },
        {
          type: "number",
          name: "Max connections pool",
          min: 1,
          defaultValue: 10,
          placeholder: "10",
          icon: "caret-up",
          field: `${prefix}_max_pool`,
          tooltip: "Maximum amount of connection to pool in memory",
          required: true,
        },
      ],
    },
  ];
}

function auth(prefix: string): IPluginConfigField {
  return {
    type: "row",
    configs: [
      {
        type: "string",
        name: "User",
        defaultValue: "root",
        placeholder: "root",
        tooltip: "User name to use for the connection",
        icon: "user-alt",
        field: `${prefix}_user`,
        required: true,
      },
      {
        type: "password",
        name: "Password",
        placeholder: "root",
        tooltip: "Optional password for the account used",
        icon: "key",
        field: `${prefix}_password`,
      },
    ],
  };
}

function ssl(prefix: string): IPluginConfigField[] {
  return [
    {
      type: "boolean",
      defaultValue: false,
      name: "Use SSL",
      icon: "lock",
      tooltip:
        "SSL encryption is configurable, enabling you to adjust your connection to the conditions determined by the server.",
      field: `${prefix}_use_ssl`,
    },
    {
      type: "group",
      name: "SSL Parameters",
      icon: "lock",
      visibility_conditions: [
        {
          condition: "=",
          field: `${prefix}_use_ssl`,
          value: true,
        },
      ],
      field: `${prefix}_ssl_group`,
      configs: [
        {
          type: "file",
          name: "CA Certificate",
          icon: "scroll",
          tooltip: "Path to the Certification Authority file for SSL",
          field: `${prefix}_ssl_ca_cert`,
        },
        {
          type: "file",
          name: "Client Certificate",
          icon: "scroll",
          tooltip: "Path the Certificate file for SSL",
          field: `${prefix}_ssl_cert`,
        },
        {
          type: "file",
          name: "Client Private Key",
          icon: "key",
          tooltip: "Path to the Key file for SSL",
          field: `${prefix}_ssl_key`,
        },
        {
          type: "string",
          name: "Cipher suits",
          icon: "lock",
          tooltip:
            "Optional list of permissible ciphers to use for SSL encryption",
          field: `${prefix}_ssl_cipher`,
        },
        {
          type: "boolean",
          defaultValue: true,
          name: "Verify server certificate",
          icon: "check",
          tooltip: "Verify if server certificate is required",
          field: `${prefix}_ssl_verify_server_cert`,
        },
      ],
    },
  ];
}

const settings: Configs = [
  {
    type: "boolean",
    field: "use_device_connection",
    name: "Use a different database connection to store device data",
    tooltip:
      "If you enable this option, Data from devices will be stored in a different MySQL connection.",
    defaultValue: false,
  },
  {
    type: "group",
    icon: "database",
    name: "Database Connection",
    field: "main",
    configs: [
      connection("main"),
      {
        type: "string",
        name: "Database",
        defaultValue: "tcore",
        placeholder: "Main database name",
        tooltip:
          "The name of the database that will store general TagoCore resources, such as Actions, Analyses and Devices",
        icon: "database",
        field: "main_database",
        required: true,
      },
      {
        type: "string",
        name: "Device database",
        defaultValue: "tcore_device",
        placeholder: "Device database name",
        tooltip: "The name of the database that will store data from devices",
        icon: "database",
        field: "device_database",
        required: true,
        visibility_conditions: [
          {
            condition: "!",
            field: "use_device_connection",
            value: true,
          },
        ],
      },
      div,
      auth("main"),
      div,
      ...pool("main"),
      div,
      ...ssl("main"),
    ],
  },
  div,
  {
    type: "group",
    icon: "device",
    name: "Device Database Connection",
    field: "device",
    configs: [
      connection("device"),
      {
        type: "string",
        name: "Database",
        defaultValue: "tcore_device",
        placeholder: "Device database name",
        tooltip: "The name of the database that will store data from devices",
        icon: "database",
        field: "device_database",
        required: true,
      },
      div,
      auth("device"),
      div,
      ...pool("device"),
      div,
      ...ssl("device"),
    ],
    visibility_conditions: [
      {
        condition: "=",
        field: "use_device_connection",
        value: true,
      },
    ],
  },
];

export default settings;
