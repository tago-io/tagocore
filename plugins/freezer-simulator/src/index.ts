import { ServiceModule } from "@tago-io/tcore-sdk";
import { startSendingData, stopSendingData } from "./data.ts";

/**
 * Configuration values for this service.
 */
interface IConfigValues {
  device_id: string;
  freezer_type: "freezer_1" | "freezer_2";
  temperature_unit: "F" | "C";
  update_frequency: string;
}

/**
 * This is the main service that will continuously send data.
 */
const FreezerService = new ServiceModule<IConfigValues>({
  id: "freezer-service",
  name: "Freezer Simulator Service",
  configs: [
    {
      name: "Device ID",
      field: "device_id",
      tooltip:
        "The freezer will act as this Device when sending data, and the data will be stored inside this Device's Bucket",
      icon: "device",
      type: "string",
      required: true,
    },
    {
      name: "Freezer type",
      field: "freezer_type",
      icon: "snowflake",
      tooltip: "Each freezer type has different simulated data",
      required: true,
      options: [
        { label: "Freezer 1", value: "freezer_1" },
        { label: "Freezer 2", value: "freezer_2" },
      ],
      type: "option",
    },
    {
      name: "Temperature unit",
      icon: "temperature-high",
      field: "temperature_unit",
      required: true,
      options: [
        { label: "°F", value: "F" },
        { label: "°C", value: "C" },
      ],
      type: "option",
    },
    {
      name: "Update frequency",
      icon: "clock",
      tooltip: "Interval in seconds between each update",
      field: "update_frequency",
      required: true,
      options: [
        { label: "5s", value: "5000" },
        { label: "10s", value: "10000" },
        { label: "30s", value: "30000" },
        { label: "1m", value: "60000" },
        { label: "5m", value: "300000" },
      ],
      type: "option",
    },
  ],
});

/**
 * Called when the service is loaded by the application.
 *
 * We only start the interval to keep sending data if the essential information was defined.
 */
FreezerService.onLoad = async (values) => {
  const id = values.device_id;
  const type = values.freezer_type;
  const frequency = Number(values.update_frequency || 5000);
  const unit = values.temperature_unit || "F";

  if (!id || !type) {
    throw "Please select the freezer type and the device ID.";
  }

  await startSendingData(id, type, unit, frequency);
};

/**
 * Called when the service is destroyed by the application.
 * We stop sending data here.
 */
FreezerService.onDestroy = async () => {
  stopSendingData();
};
