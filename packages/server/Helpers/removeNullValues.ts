/**
 * Removes all null and undefined values from an object.
 */
function removeNullValues<T>(value: T): T {
  for (const key in value) {
    if (value[key] === null || value[key] === undefined || value[key] === "") {
      delete value[key];
    }
  }

  return value;
}

export default removeNullValues;
