import os from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("os", () => ({
  default: {
    networkInterfaces: vi.fn(() => ({})),
    platform: vi.fn(() => ({})),
    hostname: vi.fn(() => ({})),
    version: vi.fn(() => ({})),
  },
}));

vi.mock("systeminformation", () => ({
  system: vi.fn(() => ({})),
  osInfo: vi.fn(() => ({})),
  mem: vi.fn(() => ({})),
  networkStats: vi.fn(() => ({})),
  networkInterfaces: vi.fn(() => ({})),
  get: vi.fn(() => ({})),
  fsSize: vi.fn(() => ({})),
  battery: vi.fn(() => ({})),
}));

import { getLocalIPs, getPlatformCode } from "./Hardware.ts";

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("Get local ip", () => {
  it("should list address", () => {
    const address = "192.168.1.101";
    os.networkInterfaces.mockReturnValueOnce({
      et0: [
        {
          address,
          netmask: "255.255.255.0",
          family: "IPv4",
          mac: "00:00:00:00:00:00",
          internal: false,
          cidr: "192.168.1.101/24",
        },
      ],
    });

    const [result] = getLocalIPs();

    expect(os.networkInterfaces).toHaveBeenCalledTimes(1);
    expect(result).toBe(address);
  });

  it("should only list IPV4", () => {
    const address = "192.168.1.101";
    os.networkInterfaces.mockReturnValueOnce({
      et0: [
        {
          address,
          netmask: "255.255.255.0",
          family: "IPv4",
          mac: "00:00:00:00:00:00",
          internal: false,
          cidr: "192.168.1.101/24",
        },
        {
          address: "",
          netmask: "255.255.255.0",
          family: "IPv6",
          mac: "00:00:00:00:00:00",
          internal: false,
          cidr: "192.168.1.101/24",
        },
      ],
    });

    const result = getLocalIPs();

    expect(os.networkInterfaces).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(address);
  });

  it("should only list external ip", () => {
    const address = "192.168.1.101";
    os.networkInterfaces.mockReturnValueOnce({
      et0: [
        {
          address,
          netmask: "255.255.255.0",
          family: "IPv4",
          mac: "00:00:00:00:00:00",
          internal: false,
          cidr: "192.168.1.101/24",
        },
        {
          address: "",
          netmask: "255.255.255.0",
          family: "IPv4",
          mac: "00:00:00:00:00:00",
          internal: true,
          cidr: "192.168.1.101/24",
        },
      ],
    });

    const result = getLocalIPs();

    expect(os.networkInterfaces).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(address);
  });
});

describe("Get platform code", () => {
  it.each([
    { platform: "win32", expected: "windows" },
    { platform: "linux", expected: "linux" },
    { platform: "darwin", expected: "mac" },
    { platform: "any", expected: "other" },
    { platform: undefined, expected: "other" },
  ])("should return $expected when $platform", ({ platform, expected }) => {
    // @ts-ignore
    expect(getPlatformCode(platform)).toBe(expected);
  });

  // TODO: add more tests
});
