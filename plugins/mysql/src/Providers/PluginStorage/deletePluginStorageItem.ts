import { getPluginConnection } from "../../Helpers/PluginConnection.ts";

/**
 * Removes a storage item of a plugin.
 */
async function deletePluginStorageItem(
  pluginID: string,
  key: string,
): Promise<void> {
  const connection = await getPluginConnection(pluginID);
  await connection.write.delete().where("key", key);
}

export default deletePluginStorageItem;
