import axios from "axios";
import { getMachineID } from "./Helpers.ts";
import TagoCores from "@tago-io/sdk/lib/modules/Resources/TagoCores";


/**
 * Lists all instances that have the current machine id.
 */
async function listTCoresByMachineID(token: string) {
  const machine_id = getMachineID();
  const tcore = new TagoCores({ token, region: "env" });
  const response = await tcore.list({
    fields: ["id", "token"],
    filter: { machine_id } as any,
  });
  return response;
}

/**
 * Creates a new instance with the given data.
 */
async function updateTCore(token: string, tcoreID: string, data: any) {
  const tcore = new TagoCores({ token, region: "env" });
  const response = await tcore.edit(tcoreID, data);
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

/**
 * Send data to Tagoio.
 */
async function sendDataToTagoio(token: string, data: any, connId: string, operation: string) {
  const response = await axios({
    url: `${process.env.TAGOIO_API}/tcore/${connId}`,
    method: "POST",
    headers: { token },
    data: {
      operation,
      data,
    },
  });
  return response.data.result;
}

export { updateTCore, createTCore, listTCoresByMachineID, sendDataToTagoio };
