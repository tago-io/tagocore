import type {
  IAccountList,
  IDatabaseAccountListQuery,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves a list of accounts.
 */
async function getAccountList(
  query: IDatabaseAccountListQuery,
): Promise<IAccountList> {
  const response = await mainDB.read.select(query.fields).from("account");

  for (const item of response) {
    if (item.created_at) {
      item.created_at = new Date(item.created_at);
    }
  }

  return response;
}

export default getAccountList;
