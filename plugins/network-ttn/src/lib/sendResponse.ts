import type { Response } from "express";

/**
 * Resolve response for AWS Lambda Proxy
 *
 * @param res - Response of the request
 * @param response - object with response parametersc
 * @param response.body - body of the response
 * @param response.status - status of the response
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sendResponse(
  res: Response,
  response: { body: string | { [key: string]: any }; status?: number },
) {
  // ? If a throw command is executed without wrapper
  if (typeof response === "string") {
    response = { body: response };
  }

  const { body, status = 200 } = response;
  res.status(status).json(body);
}

export default sendResponse;
