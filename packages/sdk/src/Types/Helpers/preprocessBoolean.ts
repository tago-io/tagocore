/**
 * Preprocesses a boolean field.
 * @param {unknown} value The value to preprocess.
 * @return {any} The processed value.
 */
function preprocessBoolean(value: unknown): boolean {
  if (value === "true" || value === "false") {
    return value === "true";
  }
  if (String(value) === "1") {
    return true;
  }
  if (value === true || value === false) {
    return value;
  }
  return !!value;
}

export default preprocessBoolean;
