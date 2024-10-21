import { getPluginConnection } from "../../Helpers/PluginConnection.ts";

/**
 * Retrieves a storage item of a plugin.
 */
async function getPluginStorageItem(
  pluginID: string,
  key: string,
): Promise<any | undefined> {
  const connection = await getPluginConnection(pluginID);

  const response = await connection
    .select("*")
    .from("storage")
    .where("key", key)
    .limit(1)
    .first();

  if (response) {
    switch (response.type) {
      case "boolean":
        response.value = response.value.toString() === "true";
        break;
      case "null":
        response.value = null;
        break;
      case "number":
        response.value = Number(response.value.toString());
        break;
      case "object":
        response.value = JSON.parse(response.value.toString());
        break;
      case "string":
        response.value = response.value.toString();
        break;
    }
  }

  return response?.value;
}

export default getPluginStorageItem;
