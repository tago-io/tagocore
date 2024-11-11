import type {
  IModuleSetupWithoutType,
  IPluginFilesystemItem,
} from "../../Types/index.ts";
import TCoreModule from "../TCoreModule/TCoreModule.ts";

/**
 * This module allows the creation of a new filesystem.
 */
class FileSystemModule extends TCoreModule {
  constructor(protected setup: IModuleSetupWithoutType) {
    super(setup, "filesystem");
  }

  /**
   * Resolves a file. Must return the path to the local file in the disk.
   */
  public async resolveFile(path: string): Promise<string> {
    return "";
  }

  /**
   * Resolves a folder structure. Must return an array of filesystem items.
   */
  public async resolveFolder(path: string): Promise<IPluginFilesystemItem[]> {
    return Promise.resolve([]);
  }
}

export default FileSystemModule;
