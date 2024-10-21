import type { TDeviceType } from "@tago-io/tcore-sdk/types";

/**
 * Returns the `pretty` name of the type of the bucket.
 */
function getDeviceTypeName(type?: TDeviceType | null) {
  if (type === "mutable") {
    return "Managed Data Optimized (Mutable)";
  }
    return "Device Data Optimized (Immutable)";
}

export default getDeviceTypeName;
