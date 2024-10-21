import type {
  IDatabaseAccountCreateTokenData,
  TGenericID,
} from "@tago-io/tcore-sdk/types";
import { mainDB } from "../../Database/index.ts";

/**
 * Generates and retrieves a new account token.
 */
async function createAccountToken(
  accountID: TGenericID,
  data: IDatabaseAccountCreateTokenData,
): Promise<void> {
  const object = { ...data, account_id: accountID };
  await mainDB.write.insert(object).into("account_token");
}

export default createAccountToken;
