import { Account } from "@tago-io/sdk";
import type { ActionQuery } from "@tago-io/sdk/out/modules/Account/actions.types";
import type { IAction, IActionListQuery } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

/**
 * Retrieves a list of actions.
 */
async function getActionList(
  page: number,
  amount: number,
  filter: any,
): Promise<IAction[]> {
  const query: IActionListQuery = {
    page,
    amount,
    filter: {
      active: filter.active ?? undefined,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: [
      "name",
      "active",
      "lock",
      "type",
      "action",
      "last_triggered",
      "created_at",
    ],
  };

  const account = new Account({ token: store.token });
  const result = await account.actions.list(query as ActionQuery);
  return result as IAction[];
}

export default getActionList;
