import { Account } from "@tago-io/sdk";
import type { IAccount } from "@tago-io/tcore-sdk/types";

/**
 * Gets the account by token.
 */
async function getAccountByToken(token: string): Promise<IAccount> {
  const account = new Account({ token });
  const result = await account.info();
  return result as unknown as IAccount;
}

export default getAccountByToken;
