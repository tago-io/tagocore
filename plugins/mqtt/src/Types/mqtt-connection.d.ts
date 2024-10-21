/* eslint-disable */
/* cSpell:disable */

// Custom types for the mqtt-connection module.

// These types are not official, and were acquired from an issue in the mqtt-connection repo:
// https://github.com/mqttjs/mqtt-connection/issues/20

/**
 * Stream-based Connection object for MQTT.
 */
declare module "mqtt-connection" {
  import type { IDevice } from "@tago-io/tcore-sdk/types";
  import type { EventEmitter } from "node:events";
  import type { Duplex } from "node:stream";
  import type { Duplexify } from "duplexify";
  import type * as mqtt from "mqtt-packet";

  /**
   * Connection callback for the constructor and other events.
   */
  type ConnectionCallback = (e?: any) => void;
  type MQTTMessageID = { messageId?: string };
  type AllPackets =
    | (Omit<Partial<mqtt.IPubackPacket>, "messageId"> & MQTTMessageID)
    | (Omit<Partial<mqtt.IPublishPacket>, "messageId"> & MQTTMessageID)
    | (Omit<Partial<mqtt.IPubrecPacket>, "messageId"> & MQTTMessageID)
    | (Omit<Partial<mqtt.IPubrelPacket>, "messageId"> & MQTTMessageID)
    | (Omit<Partial<mqtt.IPubcompPacket>, "messageId"> & MQTTMessageID);

  /**
   * Connection constructor.
   * This is what can be passed to the main function of the module.
   */
  interface ConnectionConstructor {
    (
      duplex?: Duplex,
      opts?: any | ConnectionCallback,
      cb?: ConnectionCallback,
    ): Connection.Connection;
    new (
      duplex?: Duplex,
      opts?: any | ConnectionCallback,
      cb?: ConnectionCallback,
    ): Connection.Connection;
  }

  let Connection: ConnectionConstructor;

  /**
   * MQTT Connection type.
   */
  namespace Connection {
    interface Connection extends Duplexify, EventEmitter {
      // Custom device type for TagoCore
      device: IDevice;

      connect(
        opts: Partial<mqtt.IConnectPacket>,
        cb?: ConnectionCallback,
      ): void;
      connack(
        opts: Partial<mqtt.IConnackPacket>,
        cb?: ConnectionCallback,
      ): void;
      publish(
        opts: Omit<Partial<mqtt.IPubackPacket>, "messageId"> & MQTTMessageID,
        cb?: ConnectionCallback,
      ): void;
      puback(opts: AllPackets, cb?: ConnectionCallback): void;
      pubrec(opts: AllPackets, cb?: ConnectionCallback): void;
      pubrel(opts: AllPackets, cb?: ConnectionCallback): void;
      pubcomp(opts: AllPackets, cb?: ConnectionCallback): void;
      subscribe(
        opts: Partial<mqtt.ISubscribePacket>,
        cb?: ConnectionCallback,
      ): void;
      suback(opts: Partial<mqtt.ISubackPacket>, cb?: ConnectionCallback): void;
      unsubscribe(
        opts: Partial<mqtt.IUnsubscribePacket>,
        cb?: ConnectionCallback,
      ): void;
      unsuback(
        opts: Partial<mqtt.IUnsubackPacket>,
        cb?: ConnectionCallback,
      ): void;
      pingreq(
        opts: Partial<mqtt.IPingreqPacket>,
        cb?: ConnectionCallback,
      ): void;
      pingresp(
        opts?: Partial<mqtt.IPingrespPacket>,
        cb?: ConnectionCallback,
      ): void;
      disconnect(
        opts: Partial<mqtt.IDisconnectPacket>,
        cb?: ConnectionCallback,
      ): void;
      auth(opts: any, cb?: ConnectionCallback): void;

      on(event: "connack", cb: (packet: mqtt.IConnackPacket) => void): any;
      on(event: "connect", cb: (packet: mqtt.IConnectPacket) => void): any;
      on(
        event: "disconnect",
        cb: (packet: mqtt.IDisconnectPacket) => void,
      ): any;
      on(event: "pingreq", cb: (packet: mqtt.IPingreqPacket) => void): any;
      on(event: "pingresp", cb: (packet: mqtt.IPingrespPacket) => void): any;
      on(
        event: "puback",
        cb: (
          packet: Omit<mqtt.IPubackPacket, "topic"> & { topic: string },
        ) => void,
      ): any;
      on(
        event: "pubcomp",
        cb: (
          packet: Omit<mqtt.IPubcompPacket, "messageId"> & MQTTMessageID,
        ) => void,
      ): any;
      on(
        event: "publish",
        cb: (
          packet: Omit<mqtt.IPublishPacket, "messageId"> & MQTTMessageID,
        ) => void,
      ): any;
      on(
        event: "pubrel",
        cb: (
          packet: Omit<mqtt.IPubrelPacket, "messageId"> & MQTTMessageID,
        ) => void,
      ): any;
      on(
        event: "pubrec",
        cb: (
          packet: Omit<mqtt.IPubrecPacket, "messageId"> & MQTTMessageID,
        ) => void,
      ): any;
      on(
        event: "suback",
        cb: (
          packet: Omit<mqtt.ISubackPacket, "messageId"> & MQTTMessageID,
        ) => void,
      ): any;
      on(
        event: "subscribe",
        cb: (packet: mqtt.ISubscribePacket & mqtt.ISubscription) => void,
      ): any;
      on(event: "unsuback", cb: (packet: mqtt.IUnsubackPacket) => void): any;
      on(
        event: "unsubscribe",
        cb: (packet: mqtt.IUnsubscribePacket & { qos: number }) => void,
      ): any;

      on(event: "close", cb: () => void): any;
      on(event: "error", cb: () => void): any;
      on(event: "disconnect", cb: () => void): any;

      destroy(): void;
      setOptions(opts: any): void;
    }
  }

  export = Connection;
}
