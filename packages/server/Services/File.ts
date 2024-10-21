import type { WriteFileOptions } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { getPluginSettingsFolder } from "./Settings.ts";

/**
 * Writes data to the file, replacing the file if it already exists.
 * `data` can be a string or a buffer.
 */
export async function writeFile(
  pluginID: string,
  filename: string,
  data: string,
  options?: WriteFileOptions,
): Promise<void> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, filename);
  await fs.writeFile(fullPath, data, options);
}

/**
 * Creates a new sub-folder in the plugins settings folder.
 * This function will recursively create each folder in the path until the last one.
 */
export async function createFolder(
  pluginID: string,
  folderPath: string,
): Promise<void> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, folderPath);
  await fs.mkdir(fullPath, { recursive: true });
}

/**
 * Deletes a file or folder.
 */
export async function deleteFileOrFolder(
  pluginID: string,
  folderPath: string,
): Promise<void> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, folderPath);
  await fs.unlink(fullPath);
}

/**
 * Reads the entire contents of a file.
 */
export async function readFile(
  pluginID: string,
  filename: string,
  options?: any,
): Promise<string> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, filename);
  const response = await fs.readFile(fullPath, options);
  return response.toString();
}

/**
 * Checks if a file exists. Returns `true` if it does, `false` if it doesn't.
 */
export async function doesFileOrFolderExist(
  pluginID: string,
  filename: string,
): Promise<boolean> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, filename);
  return await fs
    .lstat(fullPath)
    .then(() => true)
    .catch(() => false);
}

/**
 * Gets the full path of a file via its filename.
 */
export async function getFileURI(
  pluginID: string,
  filename: string,
): Promise<string> {
  const root = await getPluginSettingsFolder(pluginID);
  const fullPath = path.join(root, filename);
  return fullPath;
}

/**
 * Gets the full path of the plugin settings folder.
 */
export async function getFolderURI(pluginID: string): Promise<string> {
  const root = await getPluginSettingsFolder(pluginID);
  return root;
}
