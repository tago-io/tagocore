function generateFileName(version, platform) {
  let arch = "";

  if (platform === "linux/amd64") {
    arch = "x86_64-unknown-linux-musleabihf";
  } else if (platform === "linux/arm64/v8") {
    arch = "aarch64-unknown-linux-musl";
  } else if (platform === "linux/arm/v7") {
    arch = "armv7-unknown-linux-musleabihf";
  }

  return `just-${version}-${arch}.tar.gz`;
}

console.log(generateFileName(process.argv[2], process.argv[3]));
