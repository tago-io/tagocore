import { z } from "zod";

/**
 * Configuration of the main OS info.
 */
export const zOSInfo = z.object({
  version: z.string(),
  arch: z.string(),
  name: z.string(),
  code: z.enum(["windows", "mac", "linux", "raspberry-pi", "other"]),
  hardware: z.string(),
  hostname: z.string(),
});

/**
 * Targets available.
 */
export const zHardwareTarget = z.enum([
  "linux-x64",
  "linux-armv7",
  "linux-arm64",
  "alpine-x64",
  "alpine-arm64",
  "mac-x64",
  "win-x64",
  "any",
]);

/**
 * Configuration of the main network info.
 */
export const zNetworkInfo = z.object({
  ip: z.string(),
  name: z.string(),
  bytesTransferred: z.number(),
  bytesDropped: z.number(),
});

/**
 * Configuration of a single computer usage statistic.
 */
export const zComputerUsage = z.object({
  total: z.number(),
  used: z.number(),
  description: z.string().optional(),
  title: z.string(),
  type: z.string(),
  detail: z.string().optional(),
});

export type IComputerUsage = z.infer<typeof zComputerUsage>;
export type THardwareTarget = z.infer<typeof zHardwareTarget>;
export type INetworkInfo = z.infer<typeof zNetworkInfo>;
export type IOSInfo = z.infer<typeof zOSInfo>;
