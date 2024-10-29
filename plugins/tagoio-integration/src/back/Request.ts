import axios from "axios";

/**
 * Creates a new instance with the given data.
 */
async function createTCore(token: string, data: any) {
  const response = await axios({
    url: `${process.env.TAGOIO_API}/tcore/instance`,
    method: "POST",
    headers: { token },
    data,
  });
  return response.data.result;
}

/**
 * Send data to Tagoio.
 */
async function sendDataToTagoio(token: string, data: any, connId: string, operation: string) {
  const response = await axios({
    url: `${process.env.TAGOIO_API}/tcore/sse/${connId}`,
    method: "POST",
    headers: { token },
    data: {
      operation,
      data,
    },
  });
  return response.data.result;
}

export { createTCore, sendDataToTagoio };
