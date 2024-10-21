import fs from "node:fs";
import extract from "extract-zip";

/**
 * Extracts a zip into a folder.
 */
async function extractZip(zipFile: string, destination: string): Promise<void> {
  // creates the destination folder if it doesn't exist
  await fs.promises.mkdir(destination, { recursive: true });

  await extract(zipFile, { dir: destination });
}

export { extractZip };
