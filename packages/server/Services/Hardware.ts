import os from "node:os";
import type { IComputerUsage, INetworkInfo } from "@tago-io/tcore-sdk/types";
import si from "systeminformation";
import { formatBytes } from "../Helpers/formatBytes.ts";

/**
 * Retrieves all the local ips of this computer.
 */
export function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const name of Object.keys(interfaces)) {
    for (const tmp of interfaces[name] || []) {
      const { address, family, internal } = tmp;
      if (family === "IPv4" && !internal) {
        addresses.push(address);
      }
    }
  }

  return addresses;
}

const platformCode = new Map([
  ["win32", "windows"],
  ["linux", "linux"],
  ["darwin", "mac"],
  // debian
  // redhat
  // ubuntu
  // amazon linux
  // fedora
  // alpine
  // bsd (not linux)
]);

export function getPlatformCode(platform: string) {
  return platformCode.get(platform) || "other";
}

/**
 * Retrieves the main information of the OS.
 */
export async function getOSInfo() {
  const system = await si.system();
  const osInfo = await si.osInfo();

  const result = {
    arch: osInfo.arch,
    name: osInfo.distro || osInfo.codename,
    code: getPlatformCode(osInfo.platform),
    hardware: "",
    hostname: osInfo.hostname,
    version: `Version ${osInfo.release}`,
  };

  const osVersion = os.version();

  if (String(osVersion).includes("rockchip")) {
    result.name = "Rock Pi";
    result.version = `${osInfo.distro || osInfo.codename} ${osInfo.release}`;
    result.hardware = "rock-pi";
  }

  if (system.raspberry) {
    result.hardware = "raspberry-pi";
    result.version = `Version ${system.raspberry.type}`;
    result.name = "Raspberry Pi";
  }

  return result;
}

/**
 * Retrieves the RAM usage.
 */
export async function getRAMUsage(): Promise<IComputerUsage> {
  const { total, used } = await si.mem();
  return {
    description: `${formatBytes(used)} / ${formatBytes(total)}`,
    title: "RAM usage",
    total,
    type: "memory",
    used,
  };
}

/**
 * Retrieves the swap memory usage.
 */
export async function getSwapUsage(): Promise<IComputerUsage | undefined> {
  const { swaptotal, swapused } = await si.mem();
  if (!swaptotal) {
    return;
  }

  return {
    description: `${formatBytes(swapused)} / ${formatBytes(swaptotal)}`,
    title: "Swap Memory usage",
    total: swaptotal,
    type: "memory",
    used: swapused,
  };
}

/**
 * Retrieves the main network information.
 */
export async function getNetworkInfo(): Promise<INetworkInfo[]> {
  const stats = await si.networkStats();
  const interfaces = await si.networkInterfaces();
  const interfacesWithIP = [
    ...interfaces.filter((x) => x.ip4 && x.ip4 !== "127.0.0.1"),
  ];

  return interfacesWithIP.map((x) => {
    const stat = stats.find((y) => y.iface === x.iface);
    return {
      bytesDropped: stat?.tx_dropped || 0,
      bytesTransferred: stat?.tx_bytes || 0,
      ip: x.ip4,
      name: x.ifaceName,
    };
  });
}

/**
 * Retrieves the CPU usage.
 */
export async function getCPUUsage(): Promise<IComputerUsage> {
  const cpu = await si.cpu();
  const { currentLoad } = await si.currentLoad();
  const percentage = Math.round(currentLoad);

  return {
    description: `${percentage}%`,
    detail: `${cpu.manufacturer} ${cpu.brand}`,
    title: "CPU usage",
    total: 100,
    type: "cpu",
    used: percentage,
  };
}

/**
 * Retrieves disk usages across all mounts.
 */
export async function getDiskUsages(): Promise<IComputerUsage[]> {
  const data = await si.fsSize();

  return data.map((x, i) => ({
    description: `${formatBytes(x.used)} / ${formatBytes(x.size)}`,
    detail: x.mount,
    title: `Disk ${i + 1}`,
    total: x.size === null ? 0 : x.size,
    type: "disk",
    used: x.used === null ? 0 : x.used,
  }));
}

/**
 * Retrieves the battery usage.
 */
export async function getBatteryUsage(): Promise<IComputerUsage | undefined> {
  const battery = await si.battery();
  if (!battery.hasBattery) {
    return;
  }

  return {
    description: battery.isCharging ? "Charging" : "",
    detail: `${battery.percent}%`,
    title: "Battery",
    total: 100,
    type: "battery",
    used: battery.percent,
  };
}

/**
 * Retrieves all the computer usage statistics.
 * Some statistics may not be available on all systems.
 */
export async function getComputerUsage(): Promise<IComputerUsage[]> {
  const usages = await Promise.all([
    getCPUUsage(),
    getRAMUsage(),
    getSwapUsage(),
    getBatteryUsage(),
    getDiskUsages(),
  ]);
  const filtered = usages.flat().filter((x) => x) as IComputerUsage[];
  return filtered;
}
