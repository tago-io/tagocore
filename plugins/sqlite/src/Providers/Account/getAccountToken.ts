import type { IAccountToken, TGenericToken } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Retrieves the token info of a particular uuid.
 */
async function getAccountToken(
  token: TGenericToken,
): Promise<IAccountToken | null> {
  const response = await knexClient
    .select("*")
    .from("account_token")
    .where("token", token)
    .first();

  if (response) {
    response.created_at = new Date(response.created_at);
    return response;
  }

  return null;
}

export default getAccountToken;
