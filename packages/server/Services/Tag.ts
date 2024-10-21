import { z } from "zod";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";

/**
 * Retrieves all the tag keys of a resource type.
 */
export async function getTagKeys(table: string) {
  const response = await invokeDatabaseFunction("getTagKeys", table);
  const parsed = await z.array(z.string()).parseAsync(response);
  return parsed;
}
