![TCore](/assets/logo-plugin-black.png)

# About

This is an [RabbitMQ](https://aws.amazon.com/sqs/) Plugin for TCore. It allows TagoCore data to use one of the most popular open source message brokers.

---

# Settings

This section describes each configuration field of this Plugin.

### Host

The host name or IP address of the RabbitMQ server using amqp protocol.

### Port

The host amqp port of the RabbitMQ server.

### Queue name

RabbitMQ queue name.

### Batch size

Amount of data fetched by each node(cluster mode). When the value is 1, the data is equally distributed between nodes (Not recommended in solo mode).

### Message time to live

Message live time on the queue. Default will never remove the message.

---

## License

MIT
