import { getMainFilesystemModule, getModuleList } from "../Services/Plugins.ts";

/**
 * Invokes a function in the main filesystem module or the local disk if the
 * main module was not informed in the settings.
 */
export async function invokeFilesystemFunction(
  method: string,
  ...args: any
): Promise<any> {
  let module = await getMainFilesystemModule();
  if (module === null) {
    // module was defined but doesn't exist
    throw new Error("Filesystem module doesn't exist or isn't running");
  }
  if (module === undefined) {
    // module was never defined (use local file system)
    const localFilesystem = getModuleList("filesystem")[0];
    module = localFilesystem;
  }

  const result = await module.invoke(method, ...args);
  return result;
}
