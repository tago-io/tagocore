import { pluginStorage } from "@tago-io/tcore-sdk";
import { getConfigValues, serviceModule } from "./index.ts";
import { receiveData } from "./receive-data.ts";
import * as requests from "./requests.ts";
import { sendData } from "./send-data.ts";

/**
 * Maximum time a domo access token is valid.
 */
const ACCESS_TOKEN_EXPIRATION_MS = 1000 * 60 * 60; // 1 hour

/**
 * Interval for the synchronization loop to run each iteration.
 */
const LOOP_INTERVAL_MS = 1000 * 60 * 60; // 1 hour

let interval: ReturnType<typeof setInterval>;
let accessToken = "";

/**
 * Gets the access token to use in requests.
 */
export function getAccessToken() {
  return accessToken;
}

/**
 * Checks if the token is empty or invalid, and if so, retrieves another token.
 */
async function checkValidityAccessToken() {
  const emptyToken = !accessToken;
  const tokenEmitTimestamp =
    (await pluginStorage.get("access-token-timestamp")) || 0;
  const outdatedToken =
    Date.now() - tokenEmitTimestamp >= ACCESS_TOKEN_EXPIRATION_MS;

  if (emptyToken || outdatedToken) {
    const clientID = getConfigValues().client_id;
    const clientSecret = getConfigValues().client_secret;
    accessToken = await requests.authenticate(clientID, clientSecret);
    await pluginStorage.set("access-token-timestamp", Date.now());
  }
}

/**
 * Does the interval procedure. This function will check if the sendData
 * or receiveData functions need to be called and handle their results.
 *
 * This is the main loop of the application, it handles errors and makes calls.
 */
async function doInterval() {
  try {
    if (
      !getConfigValues().enable_send_data &&
      !getConfigValues().enable_receive_data
    ) {
      return;
    }

    await checkValidityAccessToken();

    const results = await Promise.all([sendData(), receiveData()]);
    const sentData = results[0] || 0;
    const recvData = results[1] || 0;

    serviceModule.showMessage(
      "info",
      `Last synchronization: ${new Date().toLocaleString()} (${sentData} sent, ${recvData} received)`,
    );
  } catch (ex: any) {
    if (ex?.request && !ex?.response) {
      // did not receive response from domo server, meaning we couldn't reach it
      // we must ignore and try again in the future
      const message =
        "Could not reach Domo during synchronization. Maybe you're offline.";
      serviceModule.showMessage("error", message);
      console.error(message);
      return;
    }

    const error =
      ex?.response?.data?.statusReason || ex?.message || ex?.toString?.();
    const message = `Error during synchronization: ${error}`;
    serviceModule.showMessage("error", message);
    console.error(message);
  }
}

/**
 * Starts intervals.
 */
export function startIntervals() {
  accessToken = "";
  interval = setInterval(doInterval, LOOP_INTERVAL_MS);
}

/**
 * Stops intervals.
 */
export function stopIntervals() {
  clearInterval(interval);
}
