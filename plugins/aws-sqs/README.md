![TCore](/assets/logo-plugin-black.png)

# About

This is an [Amazon SQS](https://aws.amazon.com/sqs/) Plugin for TCore. It allows TagoCore data to use a fully managed message queuing service.

---

# Credentials

This plugin need AWS credentials to work properly.
The credentials can be defined in `.aws` folder or using environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`. Read more about [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

# Settings

This section describes each configuration field of this Plugin.

### Queue URL

This is the SQS queue url to used by the plugin.

### Region

AWS region of the SQS queue.

### Batch size

Amount of data fetched by each node(cluster mode). When the value is 1, the data is equally distributed between nodes (Not recommended in solo mode).

---

## License

MIT
