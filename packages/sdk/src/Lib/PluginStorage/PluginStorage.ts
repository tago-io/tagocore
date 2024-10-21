import APIBridge from "../APIBridge/APIBridge.ts";

/**
 * Class to manage data storage of your plugin.
 */
class PluginStorage extends APIBridge {
  /**
   * Retrieves a storage item.
   */
  public async get(key: string): Promise<any> {
    const response = await this.invokeApiMethod("getPluginStorageItem", key);
    return response;
  }

  /**
   * Creates/edits a storage item.
   */
  public async set(key: string, value: any): Promise<void> {
    await this.invokeApiMethod("setPluginStorageItem", key, value);
  }

  /**
   * Deletes a storage item.
   */
  public async delete(key: string): Promise<void> {
    await this.invokeApiMethod("deletePluginStorageItem", key);
  }

  /**
   * Retrieves all storage items.
   */
  public async getAllItems(): Promise<any> {
    const response = await this.invokeApiMethod("getAllPluginStorageItems");
    return response;
  }
}

const instance = new PluginStorage();
export default instance;
