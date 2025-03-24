import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

/**
 * Converts a JSON to a .yml and saves it into a file.
 */
export async function saveYml(json: any, filePath: string): Promise<void> {
  try {
    const file = yaml.dump(json);

    const folder = path.join(filePath, "..");
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(filePath, file);
  } catch (ex) {
    //  TODO:(rc) improve error handling later in the RC
  }
}

/**
 * Gets a .yml file and converts it into a JSON.
 */
export async function loadYml(path: string, defaultValue = {}): Promise<any> {
  try {
    const file = await fs.readFile(path, { encoding: "utf8" });
    const json = yaml.load(file);
    return json || defaultValue;
  } catch (ex) {
    return defaultValue;
  }
}
