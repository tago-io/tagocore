import type {
  IDatabaseAccountCreateTokenData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex.ts";

/**
 * Generates and retrieves a new account token.
 */
async function createAccountToken(
  accountID: TGenericID,
  data: IDatabaseAccountCreateTokenData,
): Promise<void> {
  const object = { ...data, account_id: accountID };
  await knexClient.insert(object).into("account_token");
}

export default createAccountToken;
