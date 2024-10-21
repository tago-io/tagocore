import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";

/**
 * Validates a `string` plugin field.
 */
function validateStringField(field: IPluginConfigField, value: string) {
  return !value || !String(value).trim();
}

export default validateStringField;
