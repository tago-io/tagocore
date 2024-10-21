import type { IAccount } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the information of a single account via its username.
 */
async function getAccountByUsername(
  username: string,
): Promise<IAccount | null> {
  const response = await mainDB.read
    .select("*")
    .from("account")
    .where({ username })
    .first();

  if (response) {
    response.created_at = new Date(response.created_at);
    return response;
  }

  return null;
}

export default getAccountByUsername;
