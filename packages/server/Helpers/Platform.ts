import { spawnSync } from "node:child_process";

const isAlpine = detectAlpine();

/**
 * Detects if the current platform is alpine or not.
 */
function detectAlpine() {
  const { platform } = process;
  if (platform !== "linux") {
    return false;
  }

  // https://github.com/sass/node-sass/issues/1589#issuecomment-265292579
  const ldd = spawnSync("ldd").stderr.toString();

  if (/\bmusl\b/.test(ldd)) {
    return true;
  }

  const lddNode = spawnSync("ldd", [process.execPath]).stdout.toString();
  return /\bmusl\b/.test(lddNode);
}

/**
 * Gets the platform for this computer.
 */
function getPlatform() {
  const platform = process.platform as string;

  if (isAlpine) {
    return "alpine";
  }

  if (platform === "darwin") return "mac";
  if (platform === "lin") return "linux";
  if (platform === "macos") return "mac";
  if (platform === "osx") return "mac";
  if (platform === "win32") return "win";
  if (platform === "windows") return "win";

  return platform;
}

/**
 * Gets the CPU architecture for this computer.
 */
function getArch() {
  if (process.arch === "arm") return "armv7";
  if (process.arch === "ia32") return "x86";
  if (process.arch === "x86_64") return "x64";
  return process.arch;
}

/**
 * Gets the platform and arch in a single string.
 * The format returned is `platform-arch`.
 */
export function getPlatformAndArch() {
  const platform = getPlatform();
  const arch = getArch();
  return `${platform}-${arch}`;
}
