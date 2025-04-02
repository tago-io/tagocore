import type { IPluginList } from "@tago-io/tcore-sdk/types";
import { useMemo } from "react";
import useSWR from "swr";

import { apiFetch } from "./apiFetch.ts";

export async function getEnabledPlugins() {
  const { data: plugins } = await apiFetch<IPluginList>("/plugin");

  return plugins;
}

export function useEnabledPlugins(options?: { skip?: boolean }) {
  const enabled = useMemo(() => {
    return !options?.skip;
  }, [options?.skip]);

  return useSWR(enabled ? ["/plugin"] : null, async () => getEnabledPlugins(), {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });
}

export async function getInstalledPluginIDs() {
  const { data: plugins } = await apiFetch<string[]>("/plugins/installed");

  return plugins ?? [];
}

export function useInstalledPluginIDs(options?: { skip?: boolean }) {
  const enabled = useMemo(() => {
    return !options?.skip;
  }, [options?.skip]);

  return useSWR(
    enabled ? ["/plugins/installed"] : null,
    async () => getInstalledPluginIDs(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
}
