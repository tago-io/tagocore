/**
 * Sets a key in local storage.
 */
export function setLocalStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (ex) {
    // ie11 doesn't support it sometimes.
  }
}

/**
 * Gets a key in local storage.
 */
export function getLocalStorage(key: string, fallback?: string) {
  try {
    const value = localStorage.getItem(key);
    return value || fallback;
  } catch (ex) {
    // ie11 doesn't support it sometimes.
    return fallback;
  }
}

/**
 * Gets a key in local storage as a boolean.
 */
export function getLocalStorageAsBoolean(
  key: string,
  fallback = false,
): boolean {
  try {
    const value = localStorage.getItem(key);
    if (value === "false") {
      return false;
    }
    if (value === "true") {
      return true;
    }
    return fallback as boolean;
  } catch (ex) {
    // ie11 doesn't support it sometimes.
    return fallback as boolean;
  }
}

/**
 * Gets a key in local storage as a JSON.
 */
export function getLocalStorageAsJSON(key: string) {
  try {
    const value = localStorage.getItem(key);
    return JSON.parse(value as string) || {};
  } catch (ex) {
    // ie11 doesn't support it sometimes.
    return {};
  }
}

/**
 * Gets a key in local storage as an array.
 */
export function getLocalStorageAsArray(key: string) {
  try {
    const value = localStorage.getItem(key);
    const response = JSON.parse(value as string) || [];
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  } catch (ex) {
    // ie11 doesn't support it sometimes.
    return [];
  }
}

/**
 * Sets a key in local storage as a JSON.
 */
export function setLocalStorageAsJSON(key: string, json: object) {
  try {
    localStorage.setItem(key, JSON.stringify(json));
  } catch (ex) {
    // ie11 doesn't support it sometimes.
  }
}
