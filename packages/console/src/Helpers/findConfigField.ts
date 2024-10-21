import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";
import { flattenConfigFields } from "@tago-io/tcore-shared";

/**
 */
function findConfigField(
  configs: IPluginConfigField[],
  fieldID: string
): IPluginConfigField | null {
  const fields = flattenConfigFields(configs);
  for (const field of fields) {
    if ("field" in field && field.field === fieldID) {
      return field;
    }
  }
  return null;
}

export default findConfigField;
