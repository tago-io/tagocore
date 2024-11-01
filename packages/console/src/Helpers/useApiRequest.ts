import axios, { type Method, type AxiosError } from "axios";
import useSWR from "swr";
import store from "../System/Store.ts";
import { getLocalStorage } from "./localStorage.ts";

/**
 * Options.
 */
interface IApiRequestOptions {
  skip?: boolean;
  method?: Method;
  data?: any;
}

/**
 * Fetcher function for the hook call.
 */
const fetcher = async (url: string, options?: IApiRequestOptions) => {
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = { token, masterPassword };
  const method = options?.method || "get";
  return axios({
    method,
    url,
    data: options?.data,
    headers,
  }).then((r) => r.data);
};

/**
 * Custom hook implementing an API request.
 */
function useApiRequest<T>(
  url: string,
  options?: IApiRequestOptions,
): {
  data: T;
  error?: AxiosError;
  revalidate: () => Promise<boolean>;
  mutate: any;
} {
  const skip = options?.skip;

  const { data, error, revalidate, mutate } = useSWR<T>(
    skip ? null : url,
    () => fetcher(url, options),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  if ((data as any)?.result !== undefined) {
    return { data: (data as any).result, error, revalidate, mutate };
  }
  return { data: data as T, error, revalidate, mutate };
}

export default useApiRequest;
