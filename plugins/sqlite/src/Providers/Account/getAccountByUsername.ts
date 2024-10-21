import type { IAccount } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves all the information of a single account via its username.
 */
async function getAccountByUsername(
  username: string,
): Promise<IAccount | null> {
  const response = await knexClient
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
