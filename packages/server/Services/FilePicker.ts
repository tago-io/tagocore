import type { IPluginFilesystemItem } from "@tago-io/tcore-sdk/types";
import { invokeFilesystemFunction } from "../Plugins/invokeFilesystemFunction.ts";
import { getModuleList } from "./Plugins.ts";

/**
 * Sorts the file array by alphabetical order.
 */
function sortFiles(children: IPluginFilesystemItem[]) {
  children.sort((a, b) => {
    if (a.is_folder && !b.is_folder) {
      return -1;
    }
    if (!a.is_folder && b.is_folder) {
      return 1;
    }
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  for (const item of children) {
    sortFiles(item.children);
  }
}

/**
 */
export async function getFileList(
  folderPath: string,
  preferLocalFs?: boolean,
): Promise<IPluginFilesystemItem[]> {
  if (preferLocalFs) {
    const localFilesystem = getModuleList("filesystem")[0];
    const result = await localFilesystem.invoke("resolveFolder", folderPath);
    sortFiles(result as IPluginFilesystemItem[]);
    return result as IPluginFilesystemItem[];
  }
  const result = await invokeFilesystemFunction("resolveFolder", folderPath);
  sortFiles(result);
  return result;
}
