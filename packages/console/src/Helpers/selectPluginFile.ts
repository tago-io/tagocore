/**
 * Opens the window selector to select a .tcore plugin file.
 */
function selectPluginFile(callback: (file: File) => void) {
  const element = document.getElementById("file-selector");
  if (element) {
    document.body.removeChild(element);
  }

  const newElement = document.createElement("input");
  newElement.setAttribute("type", "file");
  newElement.setAttribute("accept", ".tcore");
  newElement.id = "file-selector";
  newElement.style.display = "none";
  newElement.onchange = () => {
    callback(newElement.files?.[0] as File);
    document.body.removeChild(newElement);
  };
  newElement.click();
  document.body.appendChild(newElement);
}

export default selectPluginFile;
