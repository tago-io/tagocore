![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Tektelic Integration plugin. It adds a new route in the TagoCore for you to be able to receive data from Tektelic using webhooks.

It also gives downlink support in one of the API routes and through actions.

---

# Settings

This section describes each configuration field for this Plugin.


### Port

Port that will be used by the integration to receive connections.


### Tektelic endpoint

Enter the URL of your Tektelic server. Needed for the integration to know where to send downlink request.


### Downlink Token

A bearer token generate at Tektelic to authorize requests from the integration.

### Authorization Code

Authorization code to be used at the Authorization header for all requests to the plugin.

---

# Adding the Webhook at Tektelic

This section describes Actions that you can use to publish or receive data from the topics being used in the Broker.

1. In the TagoCore, fill up the Authorization Code field and copy it.

2.T ektelic provides a few Data Converters for you, which mean it will send the data already converted to TagoIO if you use one of them.
If you wish to use the data converter from TagoCore, if Tektelic doesn’t have the one for you for example, you must follow this step.

Go to your Tektelic console > Data Converter > Click in the plus button.


Fill the fields accordingly:

Name: TagoCore
Type: Custom
Decoder: Copy the one bellow.
Decoder:

    // Do not decode anything, just put it into AS as is 
    var arr = [];
    for (var i = 0; i < bytes.length; ++i) {
        arr.push(bytes[i]);
    }
    return {"bytes": JSON.stringify(arr), "port": port, "payload length": bytes.length};

Encoder:

    // Encode downlink messages sent in 
    // Base64 format as an array or buffer of bytes.
    function atob(input) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var str = String(input).replace(/[=]+$/, ''); // #31: ExtendScript bad parse of /=
        if (str.length % 4 === 1) {
            var msg = "'atob' failed: The string to be decoded is not correctly encoded.";
            throw new InvalidCharacterError(msg);
        }
        for (
            var bc = 0, bs, buffer, idx = 0, output = '';
            buffer = str.charAt(idx++);
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4)
              ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            buffer = chars.indexOf(buffer);
        }
        return output;
    }

    function base64ToArray(base64) {
        var binary_string = atob(base64);
        var len = binary_string.length;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push(binary_string.charCodeAt(i));
        }
        return new Int8Array(result);
    }

    if (data.params) {
        var bytes = base64ToArray(data.params.data);
        return {"port": data.params.port, "bytes": bytes};
    }

    return {"port": 0, "bytes": [0x00]};

3. Go to your Tektelic console and create a new Integration. You can create a new integration configuration under the menu **Applications > Select your Application > Integrations > + Button**.

Fill the fields accordingly:

* **Name**: Any name for this integration. For example: TagoIO.
* **Type**: TagoCore
* **Data Converter**: The correct data converter for your devices.
* **Application address**: Enter the your TagoCore address
* **Port**: Enter the port you did setup in the plugin configuration page
* **Headers**:  Press the ADD button to add a header. Enter authorization-code for the key, and paste the authorization code from step 1 in it's value.


![Tektelic Configuration](/assets/tektelic-help.png)

---
# Setting up the Device on TagoCore
The network server LoraWAN Tektelic sends the device EUI as an identification of which device is sending data.

In order for the integration to properly identify the device, you must add a tag of each one of your devices in the TagoCore, as follow:

* **Tag key**: serial
* **Tag value**: copy the Device EUI in the value of the tag.

For TagoCore to interpret the payload sent by Tektelic, you need to go to the device and select the Encoder Stack as Tektelic LoRaWAN.

---
# Action type: Send downlink to the device
This integration also add a new action which you can use the send downlink to the device. Such as select as type of the action when setting up new actions.

If using an Action trigger of Variable, you can enter dynamically setup the device and payload:

* **Device**: You can enter $DEVICE_ID$ to dynamically get the ID of the device that triggered the action.
* **Payload**: You can enter $VALUE$ to dynamically get the value of the variable.

## License

MIT
