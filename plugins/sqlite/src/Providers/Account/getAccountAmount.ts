import { knexClient } from "../../knex.ts";

/**
 * Retrieves the amount of accounts registered.
 */
async function getAccountAmount(): Promise<number> {
  const data = await knexClient.count("id as amount").from("account").first();

  const amount = Number((data as any)?.amount);
  return amount;
}

export default getAccountAmount;
