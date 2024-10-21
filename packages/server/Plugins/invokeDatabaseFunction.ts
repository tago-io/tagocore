import { getMainDatabaseModule } from "../Services/Plugins.ts";

/**
 * Invokes a function from the main database plugin.
 */
export async function invokeDatabaseFunction(
  method: string,
  ...args: any
): Promise<any> {
  const module = await getMainDatabaseModule();
  if (!module) {
    throw new Error("Database plugin not found");
  }
  if (module.state !== "started") {
    throw new Error("Database connection is not active");
  }

  const result = await module.invoke(method, ...args);
  return result;
}
