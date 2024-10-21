import type { IDeviceParameter } from "@tago-io/tcore-sdk/types";

/**
 * Normalizes the configuration parameters array to return a consistent
 * output free of small errors.
 */
function normalizeConfigParameters(params?: IDeviceParameter[]) {
  if (!params) {
    return [];
  }

  if (params.length === 1) {
    if (!params[0].key && !params[0].value && !params[0].sent) {
      return [];
    }
  }

  const normalized = params.map((x) => ({
    sent: !!x.sent,
    key: x.key,
    value: x.value,
  }));

  return normalized;
}

export default normalizeConfigParameters;
