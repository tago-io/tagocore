![TagoCore](/assets/logo-plugin-black.png)

# About

This is a Domo Integration for TagoCore. This plugin will synchronize data points between Domo DataSets and TagoCore devices. It's possible to receive data from Domo and sent data to Domo as well.

This Plugin uses a loop mechanism to synchronize data every hour. If the plugin is not able to reach the Domo API during a synchronization it will hold data until the next synchronization.

---

# Settings

This section describes each configuration field of this Plugin.

### Client ID

Client ID from your Domo developer account. We need this information to authenticate requests to the Domo API.

### Client Secret

Client Secret from your Domo developer account. We need this information to authenticate requests to the Domo API.

### Send data to a Domo DataSet

This switch enables you to send data from a Domo DataSet. The DataSet will be automatically created and managed by TagoCore. You may add manual data to the Domo DataSet directly or via the API, but you **shouldn't** change the DataSet structure.



- **Single Device**: This option will only be visible if you choose to send data to a Domo DataSet. The data from **Device ID** informed will be sent to the Domo DataSet.

- **Multiple Device**: This option will only be visible if you choose to send data to a Domo DataSet. The data from Devices matching the **Device tags** informed will be sent to the Domo DataSet.

### Receive data from a Domo DataSet

This switch enables you to receive data from a Domo DataSet. The DataSet ID informed here needs to have the following structure:

- **Column 1**: STRING with the name variable
- **Column 2**: STRING with the name value
- **Column 3**: STRING with the name unit
- **Column 4**: STRING with the name time

The **value** will always be inserted into the Device as a string, but you may use Payload parsers, Encoder Modules, or even Analyses in order to convert the data to a numeric or boolean type.

The **time** needs to be a UNIX timestamp in milliseconds.

- **DataSet ID**: This option will only be visible if you choose to receive data from a Domo DataSet. The data will be acquired from this DataSet.

- **Device ID**: This option will only be visible if you choose to receive data from a Domo DataSet. The data will be inserted into this Device.

---

## License

MIT
