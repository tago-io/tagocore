import { zPluginStorageItemSet } from "@tago-io/tcore-sdk/types";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";

/**
 * Retrieves a storage item of a plugin.
 */
export async function getPluginStorageItem(pluginID: string, key: string) {
  const response = await invokeDatabaseFunction(
    "getPluginStorageItem",
    pluginID,
    key,
  );
  return response;
}

/**
 * Creates/edits a storage item of a plugin.
 */
export async function setPluginStorageItem(
  pluginID: string,
  key: string,
  value: any,
) {
  const parsed = await zPluginStorageItemSet.parseAsync({ key, value });
  await invokeDatabaseFunction("setPluginStorageItem", pluginID, parsed);
}

/**
 * Deletes a storage item of a plugin.
 */
export async function deletePluginStorageItem(pluginID: string, key: string) {
  await invokeDatabaseFunction("deletePluginStorageItem", pluginID, key);
}

/**
 * Retrieves all storage items.
 */
export async function getAllPluginStorageItems(pluginID: string): Promise<any> {
  const response = await invokeDatabaseFunction(
    "getAllPluginStorageItems",
    pluginID,
  );
  for (const item of response) {
    item.created_at = undefined;
    item.type = undefined;
  }
  return response;
}
