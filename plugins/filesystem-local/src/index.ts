import { FileSystemModule } from "@tago-io/tcore-sdk";
import { resolveFile } from "./resolveFile.ts";
import { resolveFolder } from "./resolveFolder.ts";

/**
 * Filesystem module.
 */
const filesystem = new FileSystemModule({
  id: "local-filesystem",
  name: "Local Disk Filesystem",
});

filesystem.resolveFile = resolveFile;
filesystem.resolveFolder = resolveFolder;
