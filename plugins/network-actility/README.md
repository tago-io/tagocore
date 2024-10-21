![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Actility Integration plugin. It adds a new route in the TagoCore for you to be able to receive data from Actility using webhooks.

It also gives downlink support in one of the API routes and through actions.

---

# Settings

This section describes each configuration field for this Plugin.


### Port

Port that will be used by the integration to receive connections.


### Tunnel Interface Key

Generate at Actility when you create the integration. Copy there and paste it here to support downlinks from TagoCore.

### Authorization Code

Authorization code to be used at the Authorization header for all requests to the plugin.

---

# Adding the Webhook at Actility

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

1. In the TagoCore, fill up the Authorization Code field and copy it.

2. Go to your Actility console. You can create a new application under the menu Applications > Create > Generic Application (HTTPS).


Fill the fields accordingly:

* **Name**: Any name for this integration. For example: TagoIO.
* **UR**L: You must enter the link for TagoCore with the port you configured at step 1. Example: http://localhost:800/uplink?authorization=YOUR-AUTHORIZATION. Replace YOUR-AUTHORIZATION by the authorization code you choose at step 1.
* **Content-Type**: JSON
* **Tunnel Interface Authentication Key**: Generate a random one and copy to use TagoIO in step 3.

3. Go back to TagoCore console and pate the Tunnel Interface Ket. Save the changes.

![Actility Configuration](/assets/actility-help.png)

---
# Setting up the Device on TagoCore
The network server LoraWAN Actility sends the device EUI as an identification of which device is sending data.

In order for the integration to properly identify the device, you must add a tag of each one of your devices in the TagoCore, as follow:

* **Tag key**: serial
* **Tag value**: copy the Device EUI in the value of the tag.

For TagoCore to interpret the payload sent by Actility, you need to go to the device and select the Encoder Stack as Actility LoRaWAN.

---
# Action type: Send downlink to the device
This integration also add a new action which you can use the send downlink to the device. Such as select as type of the action when setting up new actions.

If using an Action trigger of Variable, you can enter dynamically setup the device and payload:

* **Device**: You can enter $DEVICE_ID$ to dynamically get the ID of the device that triggered the action.
* **Payload**: You can enter $VALUE$ to dynamically get the value of the variable.

## License

MIT
