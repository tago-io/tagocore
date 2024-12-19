import type { TGenericID } from "@tago-io/tcore-sdk/types";

// FIXME: remove this with the entire bucket module
/** @deprecated */
async function deleteBucketVariables(
  id: TGenericID,
  params: any,
): Promise<void> {
  throw new Error("To be removed");
}

export default deleteBucketVariables;
