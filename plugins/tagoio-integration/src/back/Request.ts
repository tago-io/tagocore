import * as getConnectionURI from "@tago-io/sdk/lib/regions.js";
import { pluginStorage } from "@tago-io/tcore-sdk";
import axios from "axios";

/**
 * Creates a new instance with the given data.
 */
async function createTCore(token: string, data: any) {
  try {
    const region = (await pluginStorage.get("region")) || "us-e1";
    const response = await axios({
      //TODO: fix this import and check if works
      url: `${getConnectionURI.default.default(region).api}/tcore/instance`,
      method: "POST",
      headers: { token },
      data,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error on creating TCore", error);
  }
}

/**
 * Send data to Tagoio.
 */
async function sendDataToTagoio(
  token: string,
  data: any,
  connId: string,
  operation: string,
) {
  try {
    const region = (await pluginStorage.get("region")) || "us-e1";
    const response = await axios({
      //TODO: fix this import and check if works
      url: `${getConnectionURI.default.default(region).api}/tcore/sse/${connId}`,
      method: "POST",
      headers: { token },
      data: {
        operation,
        data,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error on sending operation ${operation}`, error);
  }
}

export { createTCore, sendDataToTagoio };
