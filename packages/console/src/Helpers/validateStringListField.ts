import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";

/**
 * Validates a `string-list` plugin field.
 */
function validateStringListField(field: IPluginConfigField, value: string[]) {
  if (!value) {
    return [true];
  }
  const listErrors = value.map((item) => !item);
  const hasError = listErrors.some((x) => x === true);
  return hasError ? listErrors : null;
}

export default validateStringListField;
