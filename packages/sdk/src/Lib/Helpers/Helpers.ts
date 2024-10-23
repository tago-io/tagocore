import type { WriteFileOptions } from "node:fs";
import { nanoid } from "nanoid";
import {
  generateResourceID,
  validateResourceID,
} from "../../Shared/ResourceID.ts";
import type { IComputerUsage } from "../../Types.ts";
import APIBridge from "../APIBridge/APIBridge.ts";

/**
 * Helper class containing useful functions available to plugin publishers.
 */
class Helpers extends APIBridge {
  /**
   * Generate a Hex Format ID with 24 characters for resources.
   * The ID will be unique and can be used to identify a resource uniquely.
   */
  public generateResourceID(): string {
    return generateResourceID();
  }

  /**
   * Generate a unique live inspector ID to group messages.
   */
  public generateLiveInspectorID(): string {
    return nanoid(10);
  }

  /**
   * Checks if a resource ID is valid or not.
   */
  public validateResourceID(resourceID: string): boolean {
    return validateResourceID(resourceID);
  }

  /**
   * Retrieves information about the OS.
   */
  public async getOSInfo(): Promise<{
    arch: string;
    name: string;
    platform: string;
    version: string;
  }> {
    return await this.invokeApiMethod("getOSInfo");
  }

  /**
   * Checks if a file exists. Returns `true` if it does, `false` if it doesn't.
   */
  public async doesFileOrFolderExist(filename: string): Promise<boolean> {
    return await this.invokeApiMethod("doesFileOrFolderExist", filename);
  }

  /**
   * Creates a new sub-folder in the plugins settings folder.
   * This function will recursively create each folder in the path until the last one, which means
   * that it will not throw an error if a folder is already created.
   */
  public async createFolder(folderPath: string): Promise<void> {
    await this.invokeApiMethod("createFolder", folderPath);
  }

  /**
   * Deletes a file or folder.
   */
  public async deleteFileOrFolder(path: string): Promise<void> {
    await this.invokeApiMethod("deleteFileOrFolder", path);
  }

  /**
   * Writes data to the file, replacing the file if it already exists.
   * `data` can be a string or a buffer.
   */
  public async writeFile(
    filename: string,
    data: string,
    options?: WriteFileOptions,
  ): Promise<void> {
    await this.invokeApiMethod("writeFile", filename, data, options);
  }

  /**
   * Reads the entire contents of a file.
   */
  public async readFile(filename: string, options?: any): Promise<string> {
    return await this.invokeApiMethod("readFile", filename, options);
  }

  /**
   * Gets the full path of a file via its filename.
   */
  public async getFileURI(filename: string): Promise<string> {
    return await this.invokeApiMethod("getFileURI", filename);
  }

  /**
   * Gets the full path of the plugin settings folder.
   */
  public async getFolderURI(): Promise<string> {
    return await this.invokeApiMethod("getFolderURI");
  }

  /**
   * Gets the usage statistics of the computer.
   */
  public async getComputerUsage(): Promise<IComputerUsage[]> {
    return await this.invokeApiMethod("getComputerUsage");
  }
}

const instance = new Helpers();
export default instance;
