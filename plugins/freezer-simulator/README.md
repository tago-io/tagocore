![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Freezer Simulator for TagoCore. This application will continuously send data to a specific device with simulated data of an Ice cream Freezer.

The data consists of `internal_temperature`, `door_status` and `compressor_status`.

- `internal_temperature` is a string which will contain a value between `5F` and `13F`.
- `door_status` is a string which will contain the value of `closed` or `open`.
- `compressor_status` is a string which will contain the value of `on` or `off`.

---

# Settings

This section describes each configuration field of this Plugin.

### Device ID

Defines the device that the freezer will simulate when sending data.

### Freezer Type

Defines the data points in the simulation of the freezer. Each freezer contains different data points, but the same fields structure.

### Temperature unit

Defines what temperature unit to send the data in. Default is **Fahrenheit**.

### Update frequency

Defines how frequent you want to send data, or, in other words, how long is the interval between each update. Default is **5s**.

---

## License

MIT
