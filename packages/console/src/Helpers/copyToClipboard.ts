const copyToClipboard = (value: string) => {
  return new Promise<void>((resolve) => {
    const textarea = document.createElement("textarea");
    textarea.textContent = value;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      resolve();
    } finally {
      document.body.removeChild(textarea);
    }
  });
};

export default copyToClipboard;
