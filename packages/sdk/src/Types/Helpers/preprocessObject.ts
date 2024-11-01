/**
 * Preprocesses an object field.
 * @param {unknown} value The value to preprocess.
 * @return {any} The processed value.
 */
function preprocessObject(value: unknown): any {
  if (typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value as string);
  } catch (ex) {
    return null;
  }
}

export default preprocessObject;
