![TagoCore](/assets/logo-plugin-black.png)

# About

This is an MySQL/MariaDB Database Plugin for TagoCore. It allows TagoCore data to be stored into a very fast,
multi-threaded, multi-user, and robust SQL database server.

---

# Lifecycle

When This Plugin starts, it will test the connection to the specified MySQL server. If there are no settings specified,
the plugin will await for settings before connecting.

Once the connection is established, the plugin will then synchronize the table structure with the MySQL server,
making sure that the database schema is ready to receive data. This process is also known as `migration`. 

If the migration fails, the connection to the MySQL Server will be terminated and data will not be able to be stored in
this plugin. If the migration succeeds, the Plugin checks if the database user contains all necessary permissions and
marks the plugin is "started".

Once the connection is active, the plugin will be ready to receive data from TagoCore.

---

# Settings

This section describes each configuration field of this Plugin.

## Host

The host name or IP address of the MySQL server.

## Port

The TCP/IP port on which the MySQL server is listening.

## User

User name to use for the connection. To ensure that this Plugin works properly,
make sure that your MySQL user has the following permissions:
`Alter, Create, Delete, Drop, Index, Insert, Select and Update`

## Password (optional)

User password. This field is optional.

## Database

Name of the database where the primary TagoCore resources will be saved on. This is the
list of tables that will be created in this database:

- device;
- analysis;
- action
- analysis_log;
- device_token;
- device_params;
- statistic;
- migrations;
- migrations_lock;

### Device Database

Database to store all data received by devices. This option will only be visible
if the option to use a different database connection to store device data is
active.

In this database, a new table will be created for new device registered. The
table name will be the device ID.

To use a different database to store all the data colleted by devices, make sure
you enable the `Use a different database connection to store device data` field.
Once you enable it, new options will appear at the bottom of the form.

---

## SSL

SSL encryption is configurable, enabling you to adjust your connection to the
conditions determined by the server

### Use SSL

Choose if your connection will use SSL.

### CA Certificate (Certificate Authority)

The path name of the Certificate Authority (CA) certificate file.

### Client Certificate

The path name of the server public key certificate file. This certificate can be sent to the client and authenticated against the CA certificate that it has.

### Client Private Key

The path name of the server private key file.

### Cipher suits

The list of permissible ciphers for connection encryption.

### Verify server certificate

Choose if the server certificate is verified, by default this is `true`.
It's not recommended to disable this field, as it can impact your security
with problems like MITM attacks.

---

## License

MIT
