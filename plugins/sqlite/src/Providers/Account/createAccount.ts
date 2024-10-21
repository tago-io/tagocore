import { knexClient } from "../../knex.ts";

/**
 * Creates a new account.
 */
async function createAccount(data: any): Promise<void> {
  await knexClient.insert(data).into("account");
}

export default createAccount;
