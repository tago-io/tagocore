![TagoCore](/assets/logo-plugin-black.png)

# About

This is a MQTT Plugin for TagoCore. It includes new **Action Triggers** and **Action Types** for you to use with your application, as well as the MQTT broker for you to connect your devices and gateways.

---

# Settings

This section describes each configuration field for this Plugin.

### Connection method

Set the method that the Plugin will use to authorize devices to connect to the MQTT Broker.

- **Connect using Device-Token:**
  When connecting to MQTT, use token as the **username** and the respective Device-Token of the device as the **password**.

- **Connect using username, password and Client ID:**
  When connecting to MQTT, use the username and password set in the MQTT Settings.

  The Broker will also use the **Client ID** to authorize the device. It must match the value of a Tag with the key **client_id** in your device.


### Username

Username to be used in the MQTT Broker if **Connection Method** is set to *Connect using username, password and Client ID*

### Password

Password to be used in the MQTT Broker if **Connection Method** is set to *Connect using username, password and Client ID*

### Port

Port that will be used by the MQTT Broker to receive connections.

---

# Actions

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

## Action Trigger

This is a new trigger added in order to create Actions from a message received in a topic.

Since published message aren't stored by default, you need to create an *Action Type: Store data in the Device Bucket* if you're planning to store data to your Device's bucket.

In the configuration, set the topics that will be listened to. Any published message to any of the topics will automatically trigger the Action.

You can also make use of wildcards **+** to match any text for the topic breadcrumbs.
Example of valid topics:
- home
- home/+
- home/+/temperature

## Action type: Store data in the Device Bucket

Once the Broker receives a message, this action type will immediately try to store the message being received into the Device's Bucket with no additional configuration or settings.

## Action type: MQTT Publish

This action type will publish a message to a specific device. You can select the device ID, QoS, Uplink Topic and Payload, as well as retain.

---

## About QoS

Here is how QoS works:

* QoS 0 : received **at most once** : The packet is sent, and that's it. There is no validation about whether it has been received.
* QoS 1 : received **at least once** : The packet is sent and stored as long as the client has not received a confirmation from the server. MQTT ensures that it *will* be received, but there can be duplicates.
* QoS 2 : received **exactly once** : Same as QoS 1 but there is no duplicates.

About data consumption: QoS 2 > QoS 1 > QoS 0.

## License

MIT
