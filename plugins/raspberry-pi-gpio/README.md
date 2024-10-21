![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Raspberry Pi GPIO integration for TagoCore. It allows you to listen to GPIO Pins to trigger different actions and activate GPIO pins as well.

---

# Settings

This section describes each configuration field of this Plugin.

### Pin configuration

In the Pin configuration field, you can define the Raspberry PI GPIO pins that will be opened. Only the pins that were opened here can be used later on.

---

# Actions

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

## Trigger: Read Raspberry Pi GPIO

This Action Trigger allows you to listen to a GPIO pin and take action when its logic level changes. You can select the desired logic level to trigger your action, as well as the Pooling time to check for changes in the pin.

## Type: Activate Raspberry Pi GPIO pin

This Action Type allows you to activate a Raspberry Pi GPIO pin by sending a signal with a specific logic level. You may select a **low**, **high**, or even a **toggle** signal to toggle between low and high.

You can also save the GPIO status in a bucket. By doing this, every time the Action is triggered, the status of the GPIO pin will be saved into a specific Bucket that you selected.

---

## License

MIT
