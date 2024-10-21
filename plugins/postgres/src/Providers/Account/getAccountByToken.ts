import type { IAccount } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";
import getAccountInfo from "./getAccountInfo.ts";

/**
 * Retrieves all the information of a single account via its token.
 */
async function getAccountByToken(token: string): Promise<IAccount | null> {
  const response = await mainDB.read
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
