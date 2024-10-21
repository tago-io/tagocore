import type { IDeviceData } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import store from "../System/Store.ts";

/**
 * Retrieves data from a device.
 */
async function getDeviceData(
  deviceID: string,
  page: number,
  amount: number,
  filter: any,
  endDate: any
): Promise<IDeviceData[]> {
  const params: any = {
    qty: amount,
    id: filter.id || undefined,
    location: filter.location || undefined,
    metadata: filter.metadata || undefined,
    ordination: "desc",
    skip: page * amount,
    time: filter.time || undefined,
    group: filter.group || undefined,
    value: filter.value || undefined,
    variable: filter.variable || undefined,
    end_date: endDate || undefined,
  };

  const response = await axios.get(`/device/${deviceID}/data`, {
    params,
    headers: { token: store.token },
  });
  const { data } = response;

  return data.result || [];
}

export default getDeviceData;
