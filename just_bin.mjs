import * as os from "node:os";

function getPlatform() {
  const arch = os.arch();
  const platform = os.platform();

  if (platform === "linux") {
    if (arch === "x64") {
      return "linux/amd64";
    }
    if (arch === "arm64") {
      return "linux/arm64/v8";
    }
    if (arch === "arm") {
      return "linux/arm/v7";
    }
  }

  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

function generateFileName(version) {
  const platform = getPlatform();
  let arch = "";

  if (platform === "linux/amd64") {
    arch = "x86_64-unknown-linux-musl";
  } else if (platform === "linux/arm64/v8") {
    arch = "aarch64-unknown-linux-musl";
  } else if (platform === "linux/arm/v7") {
    arch = "armv7-unknown-linux-musleabihf";
  }

  return `just-${version}-${arch}.tar.gz`;
}

console.log(generateFileName(process.argv[2]));
