![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Everynet Integration plugin. It adds a new route in the TagoCore for you to be able to receive data from Everynet using webhooks.

It also gives downlink support in one of the API routes and through actions.

---

# Settings

This section describes each configuration field for this Plugin.


### Port

Port that will be used by the integration to receive connections.

### Everynet Region

Region of your everynet, usually described as us, atc, eu. You can check the URL you're acessing Everynet, as it contains the region: https://ns.**atc**.everynet.io/login
### Everynet Connector ID

You must access the Everynet console and get the connector ID of the integration you created.
### Authorization Code

Authorization code to be used at the Authorization header for all requests to the plugin.

---

# Adding the Webhook at Everynet

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

1. In the TagoCore, fill up the Authorization Code field and copy it.

2. Go to your Everynet console and create a new Filter. Make sure to include all devices you want in the filter, and to enable the message types: uplink, downlink and downlink_request.

Copy the Filter ID to use in the step 3.

3. In the Everynet console, go to connections and create a new HTTP connection

Fill the fields accordingly:

* **Filter**: Enter the Filter ID generated from Step 2.
* **Application URL**: Enter the URL of the TagoCore with the port you did set in the plugin. Add the {type} as endpoint. Example: http://localhost:8000/{type}
* **Description**: A custom connector name
* **Authorization Header**: Enter the Authorization from TagoIO

Press the save button.

![Everynet Configuration](/assets/everynet-help.png)

---
# Setting up the Device on TagoCore
The network server LoraWAN Everynet sends the device EUI as an identification of which device is sending data.

In order for the integration to properly identify the device, you must add a tag of each one of your devices in the TagoCore, as follow:

* **Tag key**: serial
* **Tag value**: copy the Device EUI in the value of the tag.

For TagoCore to interpret the payload sent by Everynet, you need to go to the device and select the Encoder Stack as Everynet LoRaWAN.

---
# Action type: Send downlink to the device
This integration also add a new action which you can use the send downlink to the device. Such as select as type of the action when setting up new actions.

If using an Action trigger of Variable, you can enter dynamically setup the device and payload:

* **Device**: You can enter $DEVICE_ID$ to dynamically get the ID of the device that triggered the action.
* **Payload**: You can enter $VALUE$ to dynamically get the value of the variable.

## License

MIT
