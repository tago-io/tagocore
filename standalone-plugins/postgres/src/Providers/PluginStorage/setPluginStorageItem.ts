import { IDatabaseSetPluginStorageData } from "@tago-io/tcore-sdk/types";
import { getPluginConnection } from "../../Helpers/PluginConnection";

/**
 * Creates/edits a storage item of a plugin.
 */
async function setPluginStorageItem(
  pluginID: string,
  data: IDatabaseSetPluginStorageData
): Promise<void> {
  const connection = await getPluginConnection(pluginID);

  const object: any = { ...data };

  if (
    data.type === "boolean" ||
    data.type === "number" ||
    data.type === "string"
  ) {
    object.value = Buffer.from(String(data.value));
  } else if (data.type === "object") {
    object.value = Buffer.from(JSON.stringify(data.value));
  } else if (data.type === "null") {
    object.value = null;
  } else {
    object.value = Buffer.from(data.value);
  }

  await connection.write
    .insert(object)
    .onConflict("key")
    .merge(["key", "type", "value"]);
}

export default setPluginStorageItem;
