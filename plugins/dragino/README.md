![TagoCore](/assets/logo-plugin-black.png)

# About

This is a pack of encoders for TagoCore.

Encoders are parsers that runs at the time the data is being inserted to your device. The parser will read the payload and port variables and output different measurements using Dragino direct instructions.

This pack contains the following encoders:
* **Dragino LAQ4**
* **Dragino LDDS75**
* **Dragino LDS02**
* **Dragino LDS03A**
* **Dragino LGT92**
* **Dragino LHT52**
* **Dragino LHT65**
* **Dragino LSN50vd22**
* **Dragino LSNPK01**
* **Dragino LSPH01**
* **Dragino LTC2**
* **Dragino LWL01**
* **Dragino LWL02**

---

# Setting up an Encoder

Once the plugin has been installed in your TagoCore, you need to go to your devices and setup an Encoder. To achieve that, do the following:

1. Go to the Device List page, and select the device you want to add the encoder to.
2. Look for the **Encoder Stack** field, and click on the **Add Encoder** button.
3. Select the Dragino encoder you want to use.

**Note: You must select only one Dragino encoder per Device.**

If you need to have multiple encoders in the same device, it is recommended to have the Dragino Encoder in the last position of the queue.

* All Dragino encoders are compatible with any LoRaWAN Plugin by default.

---

# Sending data to the Encoder

The instructions below are not important if you're using a LoraWaN Plugin to receive data.

Any data that goes through the device will automatically run through the Dragino Encoder, but this plugin encoder requires the data to have specific variable names in order to properly parse the payload.

When sending data, make sure you have both the **payload** and **port** variables being sent. Example:

```
[
  {
    "variable": "payload",
    "value": "0d057c001e003c000007d0",
    "time": "2021-09-16T17:51:43.672Z"
  },
  {
    "variable": "port",
    "value": 2,
    "time": "2021-09-16T17:59:43.672Z"
  }
]
```
 
* The only required field keys are **variable** and **port**. Other fields are ignored, but will be kept when stored into the device.

---

## License

MIT
