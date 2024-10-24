import { Account } from "@tago-io/sdk";
import axios from "axios";
import { getMachineID } from "./Helpers.ts";

/**
 * Lists all instances that have the current machine id.
 */
async function listTCoresByMachineID(token: string) {
  const machine_id = getMachineID();
  const account = new Account({ token, region: "env" });
  const response = await account.tagocores.list({
    fields: ["id", "token"],
    filter: { machine_id } as any,
  });
  return response;
}

/**
 * Creates a new instance with the given data.
 */
async function updateTCore(token: string, tcoreID: string, data: any) {
  const account = new Account({ token, region: "env" });
  const response = await account.tagocore.edit(tcoreID, data);
  return response;
}

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

export { updateTCore, createTCore, listTCoresByMachineID };
