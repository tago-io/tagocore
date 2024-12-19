import { Resources } from "@tago-io/sdk";
import type { IAccount } from "@tago-io/tcore-sdk/types";

async function getAccountByToken(token: string): Promise<IAccount> {
  const resources = new Resources({ token });
  const result = await resources.account.info();

  return result as unknown as IAccount;
}

export default getAccountByToken;
