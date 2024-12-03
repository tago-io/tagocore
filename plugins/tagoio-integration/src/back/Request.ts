import * as getConnectionURI from "@tago-io/sdk/lib/regions.js";
import axios from "axios";

/**
 * Creates a new instance with the given data.
 */
async function createTCore(token: string, data: any) {
  try {
    const response = await axios({
      url: `${getConnectionURI.default.default("usa-1").api}/tcore/instance`,
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
    const response = await axios({
      url: `${getConnectionURI.default.default("usa-1").api}/tcore/sse/${connId}`,
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
