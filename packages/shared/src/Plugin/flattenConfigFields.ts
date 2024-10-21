import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";

/**
 */
function flattenConfigFields(
  configs: IPluginConfigField[],
): IPluginConfigField[] {
  const data: IPluginConfigField[] = [];

  for (const field of configs) {
    if ("field" in field && field.field) {
      data.push(field);
    }

    if ("options" in field && field.options) {
      // radio has options, each option has configs
      for (const option of field.options) {
        if ("configs" in option && option.configs) {
          const subData = flattenConfigFields(option.configs);
          data.push(...subData);
        }
      }
    }

    if ("configs" in field && field.configs) {
      // row, group, and other fields have a `configs` option
      const subData = flattenConfigFields(field.configs);
      data.push(...subData);
    }
  }

  return data;
}

export default flattenConfigFields;
