import type { IPluginConfigField } from "@tago-io/tcore-sdk/types";
import findConfigField from "./findConfigField.ts";
import isNumber from "./isNumber.ts";

/**
 */
function isConfigFieldVisible(
  rootConfigs: IPluginConfigField[],
  fieldToCheck: IPluginConfigField,
  values: any
) {
  const conditions = fieldToCheck.visibility_conditions || [];
  if (conditions.length === 0) {
    return true;
  }

  for (const data of conditions) {
    const { value, valueTwo, condition } = data;

    if (condition === "*") {
      // any condition matches, just exit to save time
      return true;
    }

    const field = findConfigField(rootConfigs, data.field);
    if (!field) {
      // field not found, exit to save time
      continue;
    }

    const fieldValue = values[data.field];
    const fieldValueParsed = isNumber(fieldValue) ? Number.parseFloat(fieldValue) : String(fieldValue);
    const fieldValueArray = [fieldValue].flat();

    const valueCondition = isNumber(value) ? Number.parseFloat(value) : String(value);
    const valueConditionTwo = isNumber(valueTwo) ? Number.parseFloat(valueTwo) : String(valueTwo);

    if (condition === "<" && fieldValueParsed < valueCondition) {
      return true;
    }if (condition === ">" && fieldValueParsed > valueCondition) {
      return true;
    }if (condition === "=") {
      if (field.type === "string-list") {
        return fieldValueArray.some((x) => x === valueCondition);
      }
      if (field.type === "select-key-select-value") {
        return fieldValueArray.some((x) => x.value === valueCondition);
      }
      if (fieldValueParsed === valueCondition) {
        return true;
      }
    } else if (condition === "!") {
      if (field.type === "string-list") {
        return !fieldValueArray.some((x) => x === valueCondition);
      }
      if (field.type === "select-key-select-value") {
        return !fieldValueArray.some((x) => x.value === valueCondition);
      }
      if (fieldValueParsed !== valueCondition) {
        return true;
      }
    } else if (condition === "ne") {
      if (field.type === "string-list") {
        return fieldValueArray.length > 0;
      }
      if (field.type === "select-key-select-value") {
        return fieldValueArray.length > 0;
      }
      if (String(fieldValue || "").trim()) {
        return true;
      }
    } else if (condition === "><") {
      if (fieldValueParsed >= valueCondition && fieldValueParsed <= valueConditionTwo) {
        return true;
      }
    }
  }

  return false;
}

export default isConfigFieldVisible;
