![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Node-RED Plugin for TagoCore. It includes new **Action Triggers** and **Action Types** for you to use with your application.

---

# Settings

This section describes each configuration field for this Plugin.


### Node-RED URL

The URL of your Node-RED server

### Username

Username from your Node-RED server, needed only if enabled at Node-RED settings.

### Password

Password from your Node-RED server, needed only if enabled at Node-RED settings.


---

# Actions

This section describes Actions that you can use to send data to a Node-RED flow.

## Action type: Send data to Node-RED

Will forward the request content from the Action to Node-RED.
In order for this to work, you must create a `HTTP IN` node with support to the endpoint you entered for the action. 

---

## Installing Node-Red on your machine:
To install Node-RED on your machine, follow this tutorial that Node-RED provided:
[https://Node-RED.org/docs/getting-started/local](https://Node-RED.org/docs/getting-started/local)

---

## Install Node TagoIO out on Node-RED:

To install TagoIO out node on Node-RED, click in `more options`, `manage pallet`, and search for `node-red-tagocore` on the `Install”` tab and click in install. When installing is finished, the TagoIO out node will appear on the “Nodes” tab. 

You can check the full process in the [Node-RED documentation](https://Node-RED.org/docs/user-guide/runtime/adding-nodes).

---

## Configure “TagoIO out” on Node-RED
To configure TagoIO out to post data on a device in TagoIO just drag the node `TagoIO out` on the working flow and
add the `device token` in the configuration field.


---

## Send data to TagoIO using the TagoIO out on Node-RED:
In order to send data to Node-RED, you will need to drag and drop the `TagoIO out` node to your flow.

Configure the flow with your Device token and choose to connect either by HTTPs or MQTT. For MQTT, you must install
the MQTT Plugin in TagoCore and configure it as well.

* Note: MQTT Integration is not available as a node in Node-RED yet. We are working to get it available a soon as possible.

Notice that you can send any type of information to TagoCore using the `TagoIO out` node, but TagoIO will only accepts data that is in JSON formatted with at least a variable and value key. You can achieve this by using a function node in the Node-RED or by adding a Payload Parser to your device in the TagoCore.

Here is a data sample that is JSON formatted for TagoCore:

```
[
  {
    "variable": "temperature",
    "value": "27",
    "group":"1631814703672",
    "unit": "C",
    "time": "2021-09-16T17:51:43.672Z"
  },
  {
    "variable": "temperature",
    "value": "29",
    "group": "1631814703672",
    "unit": "C",
    "time": "2021-09-16T17:59:43.672Z"
  }
]
```
 
The payload message is already in the TagoIO pattern, if your device does not have this pattern, you will need to create a function that normalizes the data to the TagoIO pattern. 

Using “inject”, just configure the msg.payload for JSON format and put the data that will be sent, in this example the following payload will be used:

---

## License

MIT
