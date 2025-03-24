import { Resources } from "@tago-io/sdk";
import type { DeviceQuery } from "@tago-io/sdk/lib/types";
import type { IDevice } from "@tago-io/tcore-sdk/types";
import store from "../System/Store.ts";

async function getDeviceList(
  page: number,
  amount: number,
  filter: any,
): Promise<IDevice[]> {
  const query = {
    page,
    amount,
    filter: {
      active: filter.active,
      name: filter.name ? `*${filter.name}*` : undefined,
      tags: filter.tags,
    },
    fields: [
      "name",
      "last_input",
      "last_output",
      "active",
      "created_at",
      "type",
      "chunk_period",
      "chunk_retention",
    ],
  };

  const resources = new Resources({ token: store.token });
  const result = await resources.devices.list(query as DeviceQuery);

  return result as unknown as IDevice[];
}

export default getDeviceList;
