import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";
import isConfigFieldVisible from "./isConfigFieldVisible.ts";
import validateStringField from "./validateStringField.ts";
import validateStringListField from "./validateStringListField.ts";

/**
 * Helper to validate all the config fields of a plugin and
 * return all the errors of the required fields.
 */
function validateConfigFields(
  configs: IPluginConfigField[],
  values: any,
  errors: any = {},
) {
  let hasError = false;

  for (const field of configs) {
    const visible = isConfigFieldVisible(configs, field, values);
    if (!visible) {
      continue;
    }

    if ("required" in field && field.required) {
      const value = values[field.field];
      let error = null;

      if (field.type === "string-list") {
        error = validateStringListField(field, value);
      } else if (field.type === "select-key-select-value") {
        error = value.map((x: any) => ({ key: !x?.key, value: !x?.value }));
        error = error.find((x: any) => x.key || x.value) ? error : null;
      } else {
        error = validateStringField(field, value);
      }

      if (error) {
        hasError = true;
        errors[field.field] = error;
      }
    }

    if ("options" in field && field.options) {
      // radio has options, each option has configs
      for (const option of field.options) {
        if ("configs" in option && option.configs) {
          const newErrors = validateConfigFields(option.configs, values);
          if (newErrors) {
            hasError = true;
            errors = newErrors;
          }
        }
      }
    }

    if ("configs" in field && field.configs) {
      // row, group, and other fields have a `configs` option
      const newErrors = validateConfigFields(field.configs, values);
      if (newErrors) {
        hasError = true;
        errors = newErrors;
      }
    }
  }

  return hasError ? errors : null;
}

export default validateConfigFields;
