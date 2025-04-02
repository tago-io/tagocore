import axios, { type Method } from "axios";

import { getLocalStorage } from "../Helpers/localStorage.ts";
import store from "../System/Store.ts";

export async function apiFetch<ResponseData = unknown>(
  url: string,
  options?: { method?: Method; data?: unknown },
) {
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = { token, masterPassword };
  const method = options?.method || "get";

  try {
    const { data: response } = await axios({
      method,
      url,
      data: options?.data,
      headers,
    });

    if (response?.result !== undefined) {
      return { data: response.result as ResponseData, error: null };
    }

    return { data: response as ResponseData, error: null };
  } catch (error) {
    return { error, data: null };
  }
}
