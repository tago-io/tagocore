import { knexClient } from "../knex.ts";

/**
 * Applies the `tags` filter.
 * @param query Knex Instance
 * @param filter Filter with Tags
 * @param resourceName Name of Resource
 * @param resourceTable [optional] If the table is different than resource name
 * @returns void
 */
function applyTagFilter(query: any, filter: any, resourceName: string) {
  if (!Array.isArray(filter.tags)) {
    return;
  }

  for (const item of filter.tags) {
    if (item.key && item.value) {
      query.whereRaw(`:resourceName:.tags like '%"key"::key,"value"::value%'`, {
        resourceName,
        key: knexClient.raw(
          `"${knexClient
            .raw(":value", { value: item.key.replace(/\*/g, "%") })
            .toString()
            .slice(1, -1)}"`,
        ),
        value: knexClient.raw(
          `"${knexClient
            .raw(":value", { value: item.value.replace(/\*/g, "%") })
            .toString()
            .slice(1, -1)}"`,
        ),
      });
    } else if (item.key) {
      query.whereRaw(`:resourceName:.tags like '%"key": :key%'`, {
        resourceName,
        key: item.key,
      });
    } else if (item.value) {
      query.whereRaw(`:resourceName:.tags like '%"value": :value%'`, {
        resourceName,
        value: item.value,
      });
    }
  }
}

export default applyTagFilter;
