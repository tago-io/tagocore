import axios from "axios";
import { getAccessToken } from "./data.ts";

/**
 * GET https://api.domo.com/oatuh/token.
 * Authenticated the client ID and client secret by generating an access token.
 * The access token here should be passed to every other request.
 */
export async function authenticate(clientID: string, clientSecret: string) {
  const authorization = Buffer.from(`${clientID}:${clientSecret}`).toString(
    "base64",
  );

  const response = await axios({
    method: "GET",
    url: "https://api.domo.com/oauth/token",
    params: {
      grant_type: "client_credentials",
      scope: ["data"].join(" "),
    },
    headers: {
      Authorization: `basic ${authorization}`,
    },
  });

  return response.data.access_token;
}

/**
 * POST https://api.domo.com/v1/datasets.
 * Creates a new DataSet on Domo, returns the dataset id.
 */
export async function createDataSet(): Promise<string> {
  const response = await axios({
    url: "https://api.domo.com/v1/datasets",
    method: "POST",
    data: {
      name: "TagoCore",
      description: "TagoCore data",
      rows: 0,
      schema: {
        columns: [
          { type: "STRING", name: "variable" },
          { type: "STRING", name: "value" },
          { type: "STRING", name: "unit" },
          { type: "STRING", name: "time" },
        ],
      },
    },
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
  });
  return response.data.id;
}

/**
 * PUT https://api.domo.com/v1/datasets/:id/data.
 * Adds data to a domo dataset.
 */
export async function appendToDataSet(datasetID: string, data: string) {
  await axios({
    url: `https://api.domo.com/v1/datasets/${datasetID}/data`,
    method: "PUT",
    data,
    params: {
      updateMethod: "APPEND",
    },
    headers: {
      "Content-type": "text/csv",
      Authorization: `bearer ${getAccessToken()}`,
    },
  });
}

/**
 * GET https://api.domo.com/v1/datasets/:id.
 * Retrieves the info of a domo dataset.
 * If the dataset doesn't exist an error will be thrown.
 */
export async function getDataSetInfo(datasetID: string) {
  const response = await axios({
    url: `https://api.domo.com/v1/datasets/${datasetID}`,
    method: "GET",
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
  });
  return response.data;
}

/**
 * GET https://api.domo.com/v1/datasets/:id/dat.
 * Retrieves all data in a dataset, returns a csv of all data.
 * If the dataset doesn't exist an error will be thrown.
 */
export async function getDataFromDataSet(datasetID: string) {
  const response = await axios({
    url: `https://api.domo.com/v1/datasets/${datasetID}/data`,
    method: "GET",
    params: {
      includeHeader: true,
    },
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
  });
  return response.data;
}
