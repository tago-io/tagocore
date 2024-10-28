import * as os from "os";
import { execSync } from "child_process";

const isMusl = () => {
  try {
    const output = execSync("ldd --version 2>&1 || true").toString();
    return output.includes("musl");
  } catch {
    return false;
  }
};

// Map Node.js architecture to our defined architectures
function resolveArch() {
  const arch = os.arch();
  switch (arch) {
    case "arm64":
      return "aarch64";
    case "arm":
      // Check if the architecture is ARMv7
      if (process.config.variables.arm_version === "7") {
        return "armv7";
      }
      return "arm"; // Fallback for other arm versions like ARMv6
    case "x64":
      return "x86_64";
    default:
      throw new Error(`Unsupported architecture: ${arch}`);
  }
}

// Map Node.js platform to our defined OS formats
function resolveOS() {
  const platform = os.platform();

  if (platform === "darwin") {
    return "apple-darwin";
  } else if (platform === "win32") {
    return "pc-windows-msvc";
  } else if (platform === "linux") {
    return !isMusl() ? "unknown-linux-musl" : "unknown-linux-musleabihf";
  } else {
    throw new Error(`Unsupported OS: ${platform}`);
  }
}

// Function to generate the filename
function generateFileName(version) {
  const arch = resolveArch();
  const os = resolveOS();
  const extension = os.includes("windows") ? ".zip" : ".tar.gz";
  return `just-${version}-${arch}-${os}${extension}`;
}

console.log(generateFileName(process.argv[2]));
