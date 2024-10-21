import type { ITag, TDatabaseGetTagKeysType } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves all the tag keys of a resource type.
 */
async function getTagKeys(type: TDatabaseGetTagKeysType): Promise<string[]> {
  const response = await knexClient.select("tags").from(type);
  const keys: string[] = [];

  for (const item of response) {
    const tags = JSON.parse(item.tags) as ITag[];
    for (const tag of tags) {
      if (!keys.includes(tag.key)) {
        keys.push(tag.key);
      }
    }
  }

  return keys;
}

export default getTagKeys;
