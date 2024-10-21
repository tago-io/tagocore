import { ServiceModule } from "@tago-io/tcore-sdk";
import { startIntervals, stopIntervals } from "./data.ts";

/**
 * Configuration values for this service.
 */
interface IConfigValues {
  client_id: string;
  client_secret: string;

  send_data_device_id: string;
  send_data_tag_key: string;
  send_data_tag_value: string;
  send_data_type: "single" | "multiple";
  enable_send_data: boolean;

  receive_dataset_id: string;
  receive_device_id: string;
  enable_receive_data: boolean;
}

/**
 * Config values from the service module.
 */
let configValues: IConfigValues;

/**
 * This is the main service that will continuously send data.
 */
const serviceModule = new ServiceModule<IConfigValues>({
  id: "domo-service",
  name: "Domo Service",
  configs: [
    {
      name: "Client ID",
      field: "client_id",
      tooltip: "ID from the generated client tab on your Domo profile",
      icon: "key",
      type: "password",
      placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      required: true,
    },
    {
      name: "Client Secret",
      field: "client_secret",
      icon: "lock",
      tooltip: "Secret from the generated client tab on your Domo profile",
      type: "password",
      required: true,
    },
    {
      type: "group",
      icon: "arrow-alt-circle-up",
      name: "Send data",
      field: "device",
      configs: [
        {
          name: "Send data to a Domo DataSet",
          field: "enable_send_data",
          type: "boolean",
          tooltip:
            "Data will be acquired from a Device and inserted into a Domo DataSet",
        },
        {
          field: "send_data_type",
          type: "radio",
          defaultValue: "single",
          visibility_conditions: [
            {
              condition: "=",
              field: "enable_send_data",
              value: true,
            },
          ],
          options: [
            {
              label: "Single device",
              value: "single",
              icon: "device",
              color: "#118888",
              description: "Send data from a single device to a Domo DataSet",
              configs: [
                {
                  name: "Device ID",
                  field: "send_data_device_id",
                  icon: "device",
                  tooltip: "ID from the target device",
                  type: "string",
                },
              ],
            },
            {
              label: "Multiple devices",
              value: "multiple",
              icon: "device-union",
              color: "#118888",
              description: "Send data from multiple devices to a Domo DataSet",
              configs: [
                {
                  type: "row",
                  configs: [
                    {
                      name: "Tag key",
                      field: "send_data_tag_key",
                      icon: "tag",
                      tooltip: "Tag key from the associated devices",
                      type: "string",
                    },
                    {
                      name: "Tag value",
                      field: "send_data_tag_value",
                      icon: "tag",
                      tooltip: "Tag value from the associated devices",
                      type: "string",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: "group",
      icon: "arrow-alt-circle-down",
      name: "Receive data",
      field: "dataset",
      configs: [
        {
          name: "Receive data from a Domo DataSet",
          field: "enable_receive_data",
          type: "boolean",
          tooltip:
            "Data will be acquired from a Domo DataSet and inserted into a Device",
        },
        {
          name: "DataSet ID",
          field: "receive_dataset_id",
          tooltip:
            "ID from the Domo DataSet that this plugin will be acquiring data from",
          icon: "list",
          type: "string",
          required: true,
          visibility_conditions: [
            {
              condition: "=",
              field: "enable_receive_data",
              value: true,
            },
          ],
        },
        {
          name: "Device ID",
          field: "receive_device_id",
          tooltip: "ID from the device to insert data into",
          icon: "device",
          type: "string",
          required: true,
          visibility_conditions: [
            {
              condition: "=",
              field: "enable_receive_data",
              value: true,
            },
          ],
        },
      ],
    },
  ],
});

/**
 * Called when the service is loaded by the application.
 * We only start the interval to keep sending data if the essential information was defined.
 */
serviceModule.onLoad = async (values) => {
  if (!values.client_id || !values.client_secret) {
    serviceModule.showMessage(
      "info",
      "Please insert a valid Client ID and Client Secret",
    );
    return;
  }

  configValues = values;
  serviceModule.hideMessage();
  startIntervals();
};

/**
 * Cleans up the plugin.
 */
serviceModule.onDestroy = async () => {
  stopIntervals();
};

export function getConfigValues() {
  return configValues;
}

export { serviceModule };
