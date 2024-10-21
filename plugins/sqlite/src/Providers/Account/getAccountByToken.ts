import type { IAccount } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";
import getAccountInfo from "./getAccountInfo.ts";

/**
 * Retrieves all the information of a single account via its token.
 */
async function getAccountByToken(token: string): Promise<IAccount | null> {
  const response = await knexClient
    .select("account_id")
    .from("account_token")
    .where("token", token)
    .first();

  if (response) {
    return await getAccountInfo(response.account_id);
  }

  return null;
}

export default getAccountByToken;
