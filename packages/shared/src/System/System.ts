// @ts-ignore
import data from "../../../../data.json" with { type: "json" };

/**
 * Gets the slug of the application, defined in the data.json.
 */
function getSystemSlug() {
  return data.slug;
}

/**
 * Gets the system name of the application.
 */
function getSystemName() {
  return data.name;
}

export { getSystemSlug, getSystemName };
