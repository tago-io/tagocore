import type { TDatabaseGetTagKeysType } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the tag keys of a resource type.
 */
async function getTagKeys(type: TDatabaseGetTagKeysType): Promise<string[]> {
  const response = await mainDB.read.select("tags").from(type);
  const keys: string[] = [];

  for (const item of response) {
    for (const tag of item.tags) {
      if (!keys.includes(tag.key)) {
        keys.push(tag.key);
      }
    }
  }

  return keys;
}

export default getTagKeys;
