import { getPluginConnection } from "../../Helpers/PluginConnection.ts";

/**
 * Removes a storage item of a plugin.
 */
async function deletePluginStorageItem(
  pluginID: string,
  key: string,
): Promise<void> {
  const connection = await getPluginConnection(pluginID);
  await connection.delete().from("storage").where("key", key);
}

export default deletePluginStorageItem;
