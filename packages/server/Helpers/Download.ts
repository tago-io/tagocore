import fs from "node:fs";
import path from "node:path";
import axios from "axios";

/**
 * Options to pass to the `downloadFile` function.
 */
interface IDownloadFileOptions {
  filename?: string;
  // eslint-disable-next-line no-unused-vars
  onProgress?: (percent: number) => void;
}

/**
 * Downloads a file and stores it into a folder.
 * @param {string} url HTTP/HTTPS URL.
 */
export async function downloadFile(
  url: string,
  dest: string,
  opts?: IDownloadFileOptions,
) {
  const response = await axios({ method: "GET", url, responseType: "stream" });
  const fileSize = Number(response.headers["content-length"] || 0);

  const destFolder = dest;
  const tempFilePath = path.join(
    destFolder,
    opts?.filename || "tcore-download",
  );
  const fileStream = fs.createWriteStream(tempFilePath);

  let downloadedSize = 0;
  let lastPercentage = 0;

  return new Promise((resolve, reject) => {
    if (fileSize) {
      response.data.on("data", (chunk: Buffer) => {
        downloadedSize += chunk.length;
        const percentage = (downloadedSize / fileSize) * 100;
        const shouldOutput =
          percentage === 100 || percentage > lastPercentage + 5;
        if (shouldOutput) {
          // only outputs every 5% or at 100% to not overwhelm the socket server
          lastPercentage = percentage;
          opts?.onProgress?.(percentage);
        }
      });
    }

    fileStream.on("finish", () => {
      fileStream.close();
      resolve(tempFilePath);
    });

    fileStream.on("error", (error) => {
      fileStream.close();
      reject(error);
    });

    response.data.pipe(fileStream);
  });
}
