import type { IAccount, TGenericID } from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves all the information of a single account.
 */
async function getAccountInfo(id: TGenericID): Promise<IAccount | null> {
  const response = await mainDB.read
    .select("*")
    .from("account")
    .where("id", id)
    .first();

  if (response) {
    response.created_at = new Date(response.created_at);
    return response;
  }

  return null;
}

export default getAccountInfo;
