import {
  ActionTriggerModule,
  ActionTypeModule,
  ServiceModule,
  core,
} from "@tago-io/tcore-sdk";
import rpio from "rpio";

/**
 * Action trigger for GPIO pins.
 * It allows users to listen to pins and perform an action when they change.
 */
const RaspberryActionTrigger = new ActionTriggerModule({
  id: "raspberry_trigger",
  name: "Raspberry Pi Trigger",
  option: {
    description: "Triggered when a GPIO pin is activated in Raspberry Pi",
    name: "Read Raspberry Pi GPIO",
    configs: [
      {
        name: "GPIO Pin",
        icon: "cog",
        tooltip: "Make sure that this pin is configured as INPUT",
        field: "pin_number_trigger",
        required: true,
        options: [
          { label: "Pin 3 - GPIO2", value: "3" },
          { label: "Pin 5 - GPIO3", value: "5" },
          { label: "Pin 7 - GPIO4", value: "7" },
          { label: "Pin 29 - GPIO5", value: "29" },
          { label: "Pin 31 - GPIO6", value: "31" },
          { label: "Pin 26 - GPIO7", value: "26" },
          { label: "Pin 24 - GPIO8", value: "24" },
          { label: "Pin 21 - GPIO9", value: "21" },
          { label: "Pin 19 - GPIO10", value: "19" },
          { label: "Pin 23 - GPIO11", value: "23" },
          { label: "Pin 32 - GPIO12", value: "32" },
          { label: "Pin 33 - GPIO13", value: "33" },
          { label: "Pin 36 - GPIO16", value: "36" },
          { label: "Pin 11 - GPIO17", value: "11" },
          { label: "Pin 12 - GPIO18", value: "12" },
          { label: "Pin 35 - GPIO19", value: "35" },
          { label: "Pin 38 - GPIO20", value: "38" },
          { label: "Pin 40 - GPIO21", value: "40" },
          { label: "Pin 15 - GPIO22", value: "15" },
          { label: "Pin 16 - GPIO23", value: "16" },
          { label: "Pin 18 - GPIO24", value: "18" },
          { label: "Pin 22 - GPIO25", value: "22" },
          { label: "Pin 37 - GPIO26", value: "37" },
          { label: "Pin 13 - GPIO27", value: "13" },
        ],
        type: "option",
      },
      {
        name: "Logic level to trigger",
        icon: "bolt",
        tooltip:
          "Select the logic level to trigger the action. This action will only be triggered if the logic level matches the pin",
        field: "logic_trigger",
        required: true,
        options: [
          {
            label: "Transition to low ",
            value: "0",
          },
          {
            label: "Transition to high",
            value: "1",
          },
        ],
        type: "option",
      },
      {
        name: "Pooling time",
        tooltip:
          "Select how often this pin will be read, value in milliseconds",
        placeholder: "Enter a value between 1 ms and 259200000 ms",
        field: "time_read",
        icon: "clock",
        type: "string",
      },
    ],
  },
});

const RaspberryActionType = new ActionTypeModule({
  id: "raspberry_action_type",
  name: "Raspberry Pi Action",
  option: {
    description: "Sends a signal to a specific GPIO pin.",
    icon: "$PLUGIN_FOLDER$/assets/icon.png",
    name: "Activate Raspberry Pi GPIO pin",
    configs: [
      {
        name: "Send GPIO status to bucket",
        field: "send_bucket_state",
        tooltip:
          "Select if you want to save the logic level in the Bucket when action is triggered",
        type: "boolean",
        icon: "bucket",
      },
      {
        name: "Device ID",
        field: "device_id",
        placeholder: "Enter device ID if sending GPIO status to Bucket",
        icon: "device",
        type: "string",
      },
      {
        name: "GPIO Pin",
        icon: "cog",
        tooltip: "Make sure that this pin is configured as OUTPUT",
        field: "pin_number_action",
        required: true,
        options: [
          { label: "Pin 3 - GPIO2", value: "3" },
          { label: "Pin 5 - GPIO3", value: "5" },
          { label: "Pin 7 - GPIO4", value: "7" },
          { label: "Pin 29 - GPIO5", value: "29" },
          { label: "Pin 31 - GPIO6", value: "31" },
          { label: "Pin 26 - GPIO7", value: "26" },
          { label: "Pin 24 - GPIO8", value: "24" },
          { label: "Pin 21 - GPIO9", value: "21" },
          { label: "Pin 19 - GPIO10", value: "19" },
          { label: "Pin 23 - GPIO11", value: "23" },
          { label: "Pin 32 - GPIO12", value: "32" },
          { label: "Pin 33 - GPIO13", value: "33" },
          { label: "Pin 36 - GPIO16", value: "36" },
          { label: "Pin 11 - GPIO17", value: "11" },
          { label: "Pin 12 - GPIO18", value: "12" },
          { label: "Pin 35 - GPIO19", value: "35" },
          { label: "Pin 38 - GPIO20", value: "38" },
          { label: "Pin 40 - GPIO21", value: "40" },
          { label: "Pin 15 - GPIO22", value: "15" },
          { label: "Pin 16 - GPIO23", value: "16" },
          { label: "Pin 18 - GPIO24", value: "18" },
          { label: "Pin 22 - GPIO25", value: "22" },
          { label: "Pin 37 - GPIO26", value: "37" },
          { label: "Pin 13 - GPIO27", value: "13" },
        ],
        type: "option",
      },
      {
        name: "Logic level to apply",
        icon: "bolt",
        tooltip: "Set the desired output status",
        field: "logic_action",
        required: true,
        options: [
          { label: "Low", value: "0" },
          { label: "High", value: "1" },
          { label: "Toggle", value: "toggle" },
        ],
        type: "option",
      },
    ],
  },
});

/**
 * Service used to define which pins to open.
 */
const RaspberryService = new ServiceModule({
  id: "raspberrypi_service",
  name: "Raspberry Pi Service",
  configs: [
    {
      name: "Pin configuration",
      icon: "cog",
      tooltip:
        "Define which pins will be opened. Only the pins that were opened can be used later on.",
      field: "topic",
      required: true,
      key: {
        options: [
          {
            label: "Pin 3 - GPIO2",
            value: "3",
          },
          {
            label: "Pin 5 - GPIO3",
            value: "5",
          },
          {
            label: "Pin 7 - GPIO4",
            value: "7",
          },
          {
            label: "Pin 29 - GPIO5",
            value: "29",
          },
          {
            label: "Pin 31 - GPIO6",
            value: "31",
          },
          {
            label: "Pin 26 - GPIO7",
            value: "26",
          },
          {
            label: "Pin 24 - GPIO8",
            value: "24",
          },
          {
            label: "Pin 21 - GPIO9",
            value: "21",
          },
          {
            label: "Pin 19 - GPIO10",
            value: "19",
          },
          {
            label: "Pin 23 - GPIO11",
            value: "23",
          },
          {
            label: "Pin 32 - GPIO12",
            value: "32",
          },
          {
            label: "Pin 33 - GPIO13",
            value: "33",
          },
          {
            label: "Pin 36 - GPIO16",
            value: "36",
          },
          {
            label: "Pin 11 - GPIO17",
            value: "17",
          },
          {
            label: "Pin 12 - GPIO18",
            value: "12",
          },
          {
            label: "Pin 35 - GPIO19",
            value: "35",
          },
          {
            label: "Pin 38 - GPIO20",
            value: "38",
          },
          {
            label: "Pin 40 - GPIO21",
            value: "40",
          },
          {
            label: "Pin 15 - GPIO22",
            value: "15",
          },
          {
            label: "Pin 16 - GPIO23",
            value: "16",
          },
          {
            label: "Pin 18 - GPIO24",
            value: "18",
          },
          {
            label: "Pin 22 - GPIO25",
            value: "22",
          },
          {
            label: "Pin 37 - GPIO26",
            value: "37",
          },
          {
            label: "Pin 13 - GPIO27",
            value: "13",
          },
        ],
      },
      value: {
        options: [
          {
            label: "Digital input - Pull None",
            value: "initial_input_pn",
          },
          {
            label: "Digital input - Pull Up",
            value: "initial_input_pup",
          },
          {
            label: "Digital output - Low",
            value: "initial_output_low",
          },
          {
            label: "Digital output - High",
            value: "initial_output_high",
          },
        ],
      },
      type: "select-key-select-value",
    },
  ],
});

/**
 * Used to open certain pins when the service is saved.
 */
RaspberryService.onLoad = async (values) => {
  values.topic?.forEach((object: any) => {
    if (object?.value === "initial_input_pn") {
      rpio.open(Number(object.key), rpio.INPUT, rpio.PULL_OFF);
    }
    if (object?.value === "initial_input_pup") {
      rpio.open(Number(object.key), rpio.INPUT, rpio.PULL_UP);
    }
    if (object?.value === "initial_output_low") {
      rpio.open(Number(object.key), rpio.OUTPUT, rpio.LOW);
    }
    if (object?.value === "initial_output_high") {
      rpio.open(Number(object.key), rpio.OUTPUT, rpio.HIGH);
    }
  });
};

let interval: any;

interface ITrigger {
  pin_number_trigger: string;
  logic_trigger: string;
}

function callback(actionID: string, trigger: ITrigger): void {
  const pinTrigger = Number(trigger.pin_number_trigger);
  const logicAux = Number(trigger.logic_trigger);
  const state = rpio.read(pinTrigger);
  if (state === logicAux) {
    core.triggerAction(actionID);
  }
}

/**
 * Called every time the trigger of the Action changes, or when the plugin first loads.
 */
RaspberryActionTrigger.onTriggerChange = async (actionID, trigger) => {
  if (!trigger) {
    return;
  }

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(
    () => callback(actionID, trigger),
    Math.max(Math.min(Number(trigger.time_read), 259200000), 1),
  );
};

/**
 * Called when the Action Trigger was activated.
 */
RaspberryActionType.onCall = async (actionID, values) => {
  if (values.logic_action === "toggle") {
    const state = rpio.read(values.pin_number_action);
    if (state === 1) {
      try {
        rpio.write(Number(values.pin_number_action), 0);
      } catch (error) {
        console.log(error);
      }
    }
    if (state === 0) {
      try {
        rpio.write(Number(values.pin_number_action), 1);
      } catch (error) {
        console.log(error);
      }
    }
  } else {
    try {
      rpio.write(Number(values.pin_number_action), Number(values.logic_action));
    } catch (error) {
      console.log(error);
    }
  }

  if (values.send_bucket_state && values?.device_id) {
    // also store the data in a bucket
    const data = {
      variable: `pin_number_${values.pin_number_action}`,
      value: values.logic_action,
    };
    await core.addDeviceData(values.device_id, data);
  }
};
