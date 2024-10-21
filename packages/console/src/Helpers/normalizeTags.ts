import type { ITag } from "@tago-io/tcore-sdk/types";

/**
 * Normalizes the tags array to return a consistent output free of small errors.
 */
function normalizeTags(params: ITag[]) {
  if (!params) {
    return [];
  }

  if (params.length === 1) {
    if (!params[0].key && !params[0].value) {
      return [];
    }
  }

  const normalized = params.map((x) => ({
    key: x.key,
    value: x.value,
  }));

  return normalized;
}

export default normalizeTags;
