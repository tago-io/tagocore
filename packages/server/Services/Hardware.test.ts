const os = {
  networkInterfaces: jest.fn(() => ({})),
  platform: jest.fn(() => ({})),
  hostname: jest.fn(() => ({})),
  version: jest.fn(() => ({})),
};

const si = {
  system: jest.fn(() => ({})),
  osInfo: jest.fn(() => ({})),
  mem: jest.fn(() => ({})),
  networkStats: jest.fn(() => ({})),
  networkInterfaces: jest.fn(() => ({})),
  get: jest.fn(() => ({})),
  fsSize: jest.fn(() => ({})),
  battery: jest.fn(() => ({})),
};

jest.mock("os", () => os);

jest.mock("systeminformation", () => si);

import { getLocalIPs, getPlatformCode } from "./Hardware.ts";

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
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
