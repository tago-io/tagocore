const fixVariable = (variable) => variable.replace(/ /g, "").toLowerCase();

/**
 * Transforms an object to a TagoIO data array object
 *
 * @param objectItem - object data to be parsed
 * @param group - default group for all data
 * @param prefix - internal use for object values
 * @returns formatted data
 */
function toTagoFormat(objectItem, group, prefix = "") {
  const result = [];
  for (const key in objectItem) {
    const item = objectItem[key];
    if (typeof item === "object") {
      result.push({
        variable: fixVariable(item.variable || `${prefix}${key}`),
        value: item.value,
        group: item.group || group,
        metadata: item.metadata,
        location: item.location,
        unit: item.unit,
      });
    } else {
      result.push({
        variable: `${prefix}${key}`.toLowerCase(),
        value: item,
        group,
      });
    }
  }

  return result;
}

export { toTagoFormat };
