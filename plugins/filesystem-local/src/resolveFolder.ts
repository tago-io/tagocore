import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { IPluginFilesystemItem } from "@tago-io/tcore-sdk/types";
import si from "systeminformation";

/**
 * Checks if a file path is directory or not.
 */
async function isDirectory(file: string): Promise<boolean> {
  try {
    const stat = await fs.promises.lstat(file);
    const isDir = stat.isDirectory();
    return isDir;
  } catch (ex) {
    return false;
  }
}

/**
 * Receives an array of paths and adds some characteristics to each file in
 * the path, such as name, full path, and if the path is a folder or not.
 */
async function transformFiles(
  root: string,
  paths: string[],
): Promise<IPluginFilesystemItem[]> {
  const transformed: any[] = [];

  for (const item of paths) {
    transformed.push({
      name: item,
      path: root ? path.join(root, item) : item,
      is_folder: await isDirectory(root ? path.join(root, item) : item),
      children: [],
    });
  }

  return transformed;
}

/**
 * List all mounts of the filesystem.
 */
async function getMounts() {
  if (os.platform() === "win32") {
    // windows
    const mounts = await si.fsSize();
    return mounts.map((x) => x.mount);
  }
  // unix-like
  return ["/"];
}

/**
 * Resolves a folder structure up until the folder path.
 */
async function resolveFolder(folderPath: string) {
  const mounts = await getMounts();
  const roots = await transformFiles("", mounts);

  const filterArray = folderPath.split(/\/|\\/g).filter((x) => x);
  if (os.platform() !== "win32") {
    // add / for unix-like systems
    filterArray.unshift("/");
  }

  const isExistingFile =
    folderPath && fs.existsSync(folderPath) && !(await isDirectory(folderPath));
  if (isExistingFile) {
    // if the folder path is pointing to a file, we must show the parent folder of the file
    filterArray.pop();
  }

  const accumulated: string[] = [];
  let last: IPluginFilesystemItem[] = roots;

  for (const folder of filterArray) {
    accumulated.push(folder);

    let accumulatedString = accumulated.join(path.sep).replace(/\/\//g, "/");
    if (accumulatedString.endsWith(":")) {
      accumulatedString += path.sep;
    }

    const subFolders = await fs.promises
      .readdir(accumulatedString)
      .catch(() => []);

    const temp = last?.find((x) => x.name === folder);
    if (temp) {
      temp.children = await transformFiles(accumulatedString, subFolders).catch(
        () => [],
      );
      last = temp.children;
    }
  }

  if (roots.length === 1) {
    return roots[0].children;
  }

  return roots;
}

export { resolveFolder };
