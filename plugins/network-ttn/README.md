![TagoCore](/assets/logo-plugin-black.png)

# About

This is a TTN/TTI v3 Integration plugin. It adds a new route in the TagoCore for you to be able to receive data from TTN/TTI using webhooks.

It also gives downlink support in one of the API routes and through actions.

---

# Settings

This section describes each configuration field for this Plugin.


### Port

Port that will be used by the integration to receive connections.

### Authorization Code

Authorization code to be used at the Authorization header for all requests to the plugin.

---

# Adding the Webhook at TTN

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

1. In the TagoCore, fill up the Authorization Code field and copy it.

2. Go to your TTN v3 console and create a new Integration. You can create a new integration under the menu Integrations > Webhooks > Add Webhook > TagoIO.

Fill the fields accordingly:

* **Webhook ID**: Any id you want. Example: tagoio-integration
* **Webhook Format**: JSON
* **URL**: Enter your integration address, such as http://localhost:8000/uplink. Make sure you include the /uplink at the end of the address. Port must be the same as in your plugin configuration.
* **Downlink API Key**: If requested, enter any value that you prefer. This will be automatically send to TagoIO in order to perform downlinks.
* **Additional Headers**: Create a Header for Authorization and set it’s value to the authorization previously generated at step 1


![TTN Configuration](/assets/ttn-help.png)

---
# Setting up the Device on TagoCore
The network server LoraWAN TTN/TTI sends the device EUI as an identification of which device is sending data.

In order for the integration to properly identify the device, you must add a tag of each one of your devices in the TagoCore, as follow:

* **Tag key**: serial
* **Tag value**: copy the Device EUI in the value of the tag.

For TagoCore to interpret the payload sent by TTN/TTI, you need to go to the device and select the Encoder Stack as TTN/TTI LoRaWAN.

---
# Action type: Send downlink to the device
This integration also add a new action which you can use the send downlink to the device. Such as select as type of the action when setting up new actions.

If using an Action trigger of Variable, you can enter dynamically setup the device and payload:

* **Device**: You can enter $DEVICE_ID$ to dynamically get the ID of the device that triggered the action.
* **Payload**: You can enter $VALUE$ to dynamically get the value of the variable.

## License

MIT
