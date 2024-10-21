import md5 from "md5";

/**
 * Generates a plugin ID based on the plugin name.
 */
export function generatePluginID(packageName: string) {
  const id = md5(packageName);
  return id;
}
