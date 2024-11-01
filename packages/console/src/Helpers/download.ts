/**
 * Mounts and downloads a file.
 * @param content The content inside of the file.
 * @param extension The extension of the file (.txt, .csv, etc).
 * @param nameFile The name of the file, it will be mounted as `nameOfFile.extension`.
 */
function downloadFile(
  content: string,
  extension: string,
  nameFile: string,
  isBase64?: boolean,
) {
  const isJson = extension === "json";
  const fileContent = isJson ? JSON.stringify(content) : content;

  const encodedUri = encodeURI(
    `data:text/${extension};${isBase64 ? "base64" : "charset=utf-8"},${fileContent}`,
  );
  const link = document.createElement("a");

  try {
    link.href = encodedUri;
    link.download = `${nameFile}.${extension}`;
    document.body.appendChild(link);

    link.click();
  } finally {
    link.remove();
  }
}

export default downloadFile;
