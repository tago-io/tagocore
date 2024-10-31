import { formatBytes } from "./formatBytes.ts";
import { it, expect, describe } from "vitest";

describe("Format bytes", () => {
  it("should return 0 B if value its equal to 0", () => {
    const result = formatBytes(0);

    expect(result).toBe("0 B");
  });

  it("should return 0 B if value its less than 0", () => {
    const result = formatBytes(-1);

    expect(result).toBe("0 B");
  });

  it("should work with bytes", () => {
    const start = formatBytes(1);
    const end = formatBytes(1_023);

    expect(start).toBe("1 B");
    expect(end).toBe("1023 B");
  });

  it("should work with KB", () => {
    const start = formatBytes(1_024);
    const end = formatBytes(1_024 ** 2 - 1);

    expect(start).toBe("1 KB");
    expect(end).toBe("1024 KB");
  });

  it("should work with MB", () => {
    const start = formatBytes(1_024 ** 2);
    const end = formatBytes(1_024 ** 3 - 1);

    expect(start).toBe("1 MB");
    expect(end).toBe("1024 MB");
  });

  it("should work with GB", () => {
    const start = formatBytes(1_024 ** 3);
    const end = formatBytes(1_024 ** 4 - 1);

    expect(start).toBe("1 GB");
    expect(end).toBe("1024 GB");
  });

  it("should work with TB", () => {
    const start = formatBytes(1_024 ** 4);
    const end = formatBytes(1_024 ** 5 - 1_024);

    expect(start).toBe("1 TB");
    expect(end).toBe("1024 TB");
  });

  // TODO: Add more tests
});
