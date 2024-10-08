import { ISummary } from "@tago-io/tcore-sdk/types";
import { knexClient } from "../../knex";

/**
 * Retrieves the summary information.
 */
async function getSummary(): Promise<ISummary> {
  const promises = await Promise.all([
    await knexClient.count("id as amount").from("device").first(),
    await knexClient.count("id as amount").from("action").first(),
    await knexClient.count("id as amount").from("analysis").first(),
  ]);

  const response: ISummary = {
    device: (promises[0]?.amount || 0) as number,
    action: (promises[1]?.amount || 0) as number,
    analysis: (promises[2]?.amount || 0) as number,
  };

  return response;
}

export default getSummary;
