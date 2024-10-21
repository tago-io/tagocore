import { mainDB } from "../../Database/index.ts";

/**
 * Retrieves the amount of accounts registered.
 */
async function getAccountAmount(): Promise<number> {
  const data = await mainDB.read.count("id as amount").from("account").first();

  const amount = Number(data?.amount || 0);
  return amount;
}

export default getAccountAmount;
