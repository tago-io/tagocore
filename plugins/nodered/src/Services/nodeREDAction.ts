import axios, { type AxiosRequestConfig } from "axios";
import type { IConfigParam } from "../types.ts";

interface IActionSettings {
  endpoint: string;
}
/**
 * Execution for Send to Node-RED action.
 *
 * @param pluginConfig - Network plugin configuration
 * @param actionID - action ID that triggered the function
 * @param actionSettings - action settings
 * @param data - device data from the action
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function nodeREDAction(
  pluginConfig: IConfigParam,
  actionID: string,
  actionSettings: IActionSettings,
  data: any,
) {
  if (!actionSettings.endpoint) {
    console.error(
      `[ERROR - Action ${actionID}] Endpoint as not been provided for the action`,
    );
    return;
  }

  // Any, so we don't need to replicate the full req object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const axiosRequest: AxiosRequestConfig = {
    method: "POST",
    url: `${pluginConfig.url}${actionSettings.endpoint}`,
    data,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await axios(axiosRequest).catch((error) => {
    console.error(
      `[ERROR - Action ${actionID}] Invalid request to ${actionSettings.endpoint} with status ${error.status}: ${error.response}`,
    );
  });
}

export default nodeREDAction;
