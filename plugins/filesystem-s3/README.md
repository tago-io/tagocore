![TCore](/assets/logo-plugin-black.png)

# About

This is a S3 Filesystem Plugin for TCore. It allows TCore files to be selected directly from an S3 Bucket.

To use this plugin, make sure to install it and set it as the main Filesystem plugin in the settings.

---

# Settings

This section describes each configuration field of this Plugin.

## Get Credentials from

Allows you to specify where to acquire the S3 Credentials from. The options are `From Environment` These are the options:
- From Environment: uses the `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` environment variables as credentials to make API calls to S3.

- From Settings: uses the credentials defined in the `AWS Access Key ID` and `AWS Secret Access Key` right here in the settings page.

### AWS Access Key ID

This field is only visible if the credentials are being acquired `From Settings`.

### AWS Secret Access Key

This field is only visible if the credentials are being acquired `From Settings`.

### AWS S3 Bucket name

Bucket name to get the files from.

### Cache policy

Specifies the amount of time in minutes that the files will be stored in the local disk before being fetched again from S3.

The files will only be fetched again from S3 **when the file needs to be used**. Just because the cache policy timer expired for a file, it does not mean that it will be instantly fetched and stored in the local disk again.

---

## License

MIT
