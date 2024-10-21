import type { IPluginFilesystemItem } from "@tago-io/tcore-sdk/Types";
import AWS from "aws-sdk";
import type { ObjectList } from "aws-sdk/clients/s3";
import { values } from "./index.ts";

/**
 * Trims leading and trailing slashes.
 */
function trimSlashes(filter: string) {
  const value = filter
    .split("/")
    .filter((v) => v !== "")
    .join("/");
  return value;
}

/**
 * Groups the files into a format that TCore understands.
 */
function groupFiles(filter: string, objects: ObjectList) {
  const result: IPluginFilesystemItem[] = [];

  for (const object of objects) {
    const keySplit = String(object.Key)
      .split("/")
      .filter((x) => x);
    const isFolder = String(object.Key).endsWith("/");
    let last = result;
    const accumulatedPath: string[] = [];

    for (let i = 0; i < keySplit.length; i++) {
      const k = keySplit[i];
      const p = last.find((x) => x.name === k);

      accumulatedPath.push(k);

      if (p) {
        last = p.children;
      } else {
        const newItem: IPluginFilesystemItem = {
          name: k,
          path: accumulatedPath.join("/"),
          is_folder: isFolder,
          children: [],
        };
        last.push(newItem);
        last = newItem.children;
      }
    }
  }

  const filterSplit = trimSlashes(filter).split("/");
  let last = result;
  for (const section of filterSplit) {
    const item = last.find((x) => x.name === section);
    for (const p of last) {
      if (p.name !== section) {
        p.children = [];
      }
    }

    if (item) {
      last = item.children;
    }
  }

  for (const p of last) {
    p.children = [];
  }

  return result;
}

/**
 * Resolves a folder structure.
 */
async function resolveFolder(filter: string): Promise<IPluginFilesystemItem[]> {
  const s3 = new AWS.S3({
    apiVersion: "2015-03-31",
    credentials: {
      accessKeyId: values.access_key,
      secretAccessKey: values.secret_access_key,
    },
  });

  const list = await s3.listObjectsV2({ Bucket: values.bucket }).promise();
  const cont = (list.Contents || []).map((x) => x);

  const files = groupFiles(filter, cont);
  return files;
}

export { resolveFolder };
