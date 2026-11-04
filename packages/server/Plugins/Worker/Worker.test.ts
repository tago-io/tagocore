import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Plugin from "../Plugin/Plugin.ts";
import { callbackInterval, startCallbackInterval } from "./Worker.ts";

vi.mock("../../Helpers/log.ts", () => ({
  log: vi.fn(),
  logError: vi.fn(),
}));

const mocksFolder = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "__mocks__",
);

/**
 * Both mock plugins never declare a module, so they keep loading until stopped.
 */
const DATABASE_PLUGIN = path.join(mocksFolder, "plugin13");
const SERVICE_PLUGIN = path.join(mocksFolder, "plugin14");

/**
 * Records whether a promise settled, so a test can check it is still pending.
 */
function track(promise: Promise<unknown>) {
  const state: { settled: boolean; error?: unknown } = { settled: false };
  promise.then(
    () => {
      state.settled = true;
    },
    (error) => {
      state.settled = true;
      state.error = error;
    },
  );
  return state;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  if (callbackInterval) {
    clearInterval(callbackInterval);
  }
  vi.useRealTimers();
});

describe("plugin load limit", () => {
  const started: Plugin[] = [];

  afterEach(async () => {
    for (const plugin of started.splice(0)) {
      await plugin.stop(true).catch(() => null);
    }
  });

  test("keeps loading a database plugin at 31 s and stops it at 10 min", async () => {
    const plugin = new Plugin(DATABASE_PLUGIN);
    started.push(plugin);
    const start = track(plugin.start());

    await vi.advanceTimersByTimeAsync(31 * 1000);
    expect(start.settled).toBe(false);
    expect(plugin.state).toBe("starting");
    expect(plugin.error).toBeNull();

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000 - 31 * 1000);
    expect(start.settled).toBe(true);
    expect(plugin.state).toBe("stopped");
    expect(plugin.error).toBe("Took too long to load (600s)");
  });

  test("stops another plugin type still loading at 31 s", async () => {
    const plugin = new Plugin(SERVICE_PLUGIN);
    started.push(plugin);
    const start = track(plugin.start());

    await vi.advanceTimersByTimeAsync(31 * 1000);
    expect(start.settled).toBe(true);
    expect(plugin.state).toBe("stopped");
    expect(plugin.error).toBe("Took too long to load (30s)");
  });
});

describe("plugin call timeout", () => {
  test("lets a database plugin's start call run for 10 min", async () => {
    startCallbackInterval();
    const plugin = new Plugin(DATABASE_PLUGIN);
    const call = track(plugin.worker.invoke("db", "start", {}));

    await vi.advanceTimersByTimeAsync(70 * 1000);
    expect(call.settled).toBe(false);

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
    expect(call.error).toBe('Response timed out (600s) for method "start"');
  });

  test("times out a database plugin's other calls at 60 s", async () => {
    startCallbackInterval();
    const plugin = new Plugin(DATABASE_PLUGIN);
    const call = track(plugin.worker.invoke("db", "getDeviceInfo", "id"));

    await vi.advanceTimersByTimeAsync(70 * 1000);
    expect(call.error).toBe(
      'Response timed out (60s) for method "getDeviceInfo"',
    );
  });

  test("times out another plugin type's start call at 60 s", async () => {
    startCallbackInterval();
    const plugin = new Plugin(SERVICE_PLUGIN);
    const call = track(plugin.worker.invoke("service", "start", {}));

    await vi.advanceTimersByTimeAsync(70 * 1000);
    expect(call.error).toBe('Response timed out (60s) for method "start"');
  });
});
