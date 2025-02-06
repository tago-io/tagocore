import type { IPlugin, TGenericID } from "@tago-io/tcore-sdk/types";
import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";
import store from "../System/Store.ts";

async function getPluginInfo(id: TGenericID) {
  const headers = { token: store.token, masterPassword: store.masterPassword };
  const response = await axios.get(`/plugin/${id}`, { headers });

  return response.data.result as IPlugin;
}

export function usePluginInfo(
  id: TGenericID | undefined,
  options?: {
    skip?: boolean;
  },
) {
  const enabled = useMemo(() => {
    return !options?.skip;
  }, [options?.skip]);

  return useSWR(
    id && enabled ? [`/plugin/${id}`, { id }] : null,
    async ([_, { id }]) => getPluginInfo(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
}

export default getPluginInfo;
