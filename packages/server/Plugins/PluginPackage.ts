import fs from "node:fs";
import path from "node:path";

/**
 * Gets the package.json file in a plugin folder.
 */
export async function getPluginPackageJSON(folder: string) {
  try {
    const pkgPath = path.join(folder, "package.json");
    const pkgStr = await fs.promises.readFile(pkgPath, "utf-8");
    const pkgData = JSON.parse(pkgStr);
    return pkgData || null;
  } catch (ex) {
    return null;
  }
}
