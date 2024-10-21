/**
 * Parses a JSON safely.
 */
export function parseSafe(value: any, fallback: any = {}) {
  try {
    if (value && typeof value === "object") {
      return value;
    }
    const result = JSON.parse(value);
    return result || fallback;
  } catch (ex) {
    return fallback;
  }
}
