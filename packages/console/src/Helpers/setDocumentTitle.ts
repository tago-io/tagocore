import { getSystemName } from "@tago-io/tcore-shared";

/**
 * Sets the document.title with a prefix.
 */
function setDocumentTitle(title: string) {
  if (title) {
    document.title = `${title} | ${getSystemName()}`;
  }
}

export default setDocumentTitle;
