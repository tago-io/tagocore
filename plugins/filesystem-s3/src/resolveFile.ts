import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pluginStorage } from "@tago-io/tcore-sdk";
import AWS from "aws-sdk";
import { values } from "./index.ts";

/**
 * Downloads a file and stores it into a temporary folder.
 */
async function downloadFile(filePath: string) {
  const s3 = new AWS.S3({
    apiVersion: "2015-03-31",
    credentials: {
      accessKeyId: values.access_key,
      secretAccessKey: values.secret_access_key,
    },
  });

  const head = s3.getObject({ Bucket: values.bucket, Key: filePath });
  const tmpdir = os.tmpdir();
  const target = path.join(tmpdir, filePath);

  await fs.promises.mkdir(path.dirname(target), { recursive: true });

  const stream = fs.createWriteStream(target);

  head.createReadStream().pipe(stream);

  return new Promise((resolve, reject) => {
    stream.on("error", (error) => {
      stream.close();
      reject(error);
    });

    stream.on("finish", () => {
      stream.close();
      pluginStorage.set(filePath, { time: Date.now(), filePath: target });
      resolve(target); // resolve the file path
    });
  });
}

/**
 * Resolves the file and returns the local path for it.
 */
async function resolveFile(filePath: string) {
  const localPath = path.join(os.tmpdir(), filePath);
  const exists = await fs.promises.stat(localPath).catch(() => false);
  if (!exists) {
    // local file doesn't exist in temp folder, download it and return the path
    return await downloadFile(filePath);
  }

  const info = await pluginStorage.get(filePath);
  if (info?.filePath) {
    const timeDiff = Date.now() - (info.time || 0);
    const maxTime = Number(values.ttl) * 1000; // max time to update it
    if (timeDiff < maxTime) {
      return info.filePath;
    }
  }

  // file exists but is out of date (too old), we will fetch it again
  // and then return the local path to the application
  return await downloadFile(filePath);
}

export { resolveFile };
