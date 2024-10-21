import { getPluginConnection } from "../../Helpers/PluginConnection.ts";

/**
 * Retrieves all storage items of a plugin.
 */
async function getAllPluginStorageItems(pluginID: string): Promise<any[]> {
  const connection = await getPluginConnection(pluginID);

  const query = connection.read.select("*");

  const response = await query;

  for (const item of response) {
    switch (item.type) {
      case "boolean":
        item.value = item.value.toString() === "true";
        break;
      case "null":
        item.value = null;
        break;
      case "number":
        item.value = Number(item.value.toString());
        break;
      case "object":
        item.value = JSON.parse(item.value.toString());
        break;
      case "string":
        item.value = item.value.toString();
        break;
    }
  }

  return response;
}

export default getAllPluginStorageItems;
