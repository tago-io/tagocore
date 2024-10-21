![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Helium Integration plugin. It adds a new route in the TagoCore for you to be able to receive data from Helium using webhooks.

It also gives downlink support in one of the API routes and through actions.

---

# Settings

This section describes each configuration field for this Plugin.


### Port

Port that will be used by the integration to receive connections.


### Helium endpoint

Enter the URL of your Helium server. Needed for the integration to know where to send downlink request.


### Downlink Token

A bearer token generate at Helium to authorize requests from the integration.

### Authorization Code

Authorization code to be used at the Authorization header for all requests to the plugin.

---

# Adding the Webhook at Helium

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

1. In the TagoCore, fill up the Authorization Code field and copy it.

2. Go to the Helium website and create a new HTTP integration. You can create the integration by going to Integrations > Add a Custom Integration > HTTP. You will be requested to enter the HTTP endpoint.

Fill the fields accordingly:

* **Endpoint URL**: Enter your integration address, such as http://localhost:8000/uplink. Make sure you include the /uplink at the end of the address. Port must be the same as in your plugin configuration.
* **Add Header**: **Authorization** and value being the Authorization code copied from TagoCore at step 1

Then follow the Helium instructions to setup the devices that will use the integration.

![Helium Configuration](/assets/helium-help.png)

---
# Setting up the Device on TagoCore
The network server LoraWAN Helium sends the device EUI as an identification of which device is sending data.

In order for the integration to properly identify the device, you must add a tag of each one of your devices in the TagoCore, as follow:

* **Tag key**: serial
* **Tag value**: copy the Device EUI in the value of the tag.

For TagoCore to interpret the payload sent by Helium, you need to go to the device and select the Encoder Stack as Helium LoRaWAN.

---
# Action type: Send downlink to the device
This integration also add a new action which you can use the send downlink to the device. Such as select as type of the action when setting up new actions.

If using an Action trigger of Variable, you can enter dynamically setup the device and payload:

* **Device**: You can enter $DEVICE_ID$ to dynamically get the ID of the device that triggered the action.
* **Payload**: You can enter $VALUE$ to dynamically get the value of the variable.

## License

MIT
