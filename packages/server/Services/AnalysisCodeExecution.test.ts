import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const { spawn } = vi.hoisted(() => {
  const createChild = () => {
    const child: any = {
      on: vi.fn(() => child),
      kill: vi.fn(),
      stdout: { setEncoding: vi.fn(), on: vi.fn() },
      stderr: { setEncoding: vi.fn(), on: vi.fn() },
    };
    return child;
  };
  return { spawn: vi.fn(createChild) };
});

vi.mock("node:child_process", () => ({ spawn }));

vi.mock("../Socket/SocketServer.ts", () => ({
  io: { to: () => ({ emit: () => undefined }) },
}));

vi.mock("./Settings.ts", () => ({
  getMainSettings: async () => ({ port: 8888 }),
}));

vi.mock("../Helpers/log.ts", () => ({
  logError: vi.fn(),
}));

vi.mock("../Plugins/invokeDatabaseFunction.ts", () => ({
  invokeDatabaseFunction: vi.fn(async (method: string) => {
    if (method === failingMethod) {
      throw new Error("Database connection is not active");
    }
    switch (method) {
      case "getAnalysisInfo":
        return storedAnalysis;
      case "getAnalysisLogs":
        return [];
      default:
        return undefined;
    }
  }),
}));

import { logError } from "../Helpers/log.ts";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import { runAnalysis } from "./AnalysisCodeExecution.ts";

const ANALYSIS_ID = "6372d4a0f1c2b3a4d5e6f708";

const analysisRow = {
  id: ANALYSIS_ID,
  name: "Hello world",
  active: true,
  binary_path: "/usr/local/bin/node",
  file_path: null,
  tags: [],
  variables: [{ key: "API_KEY", value: "secret" }],
  created_at: new Date(),
  last_run: null,
  updated_at: null,
};

let storedAnalysis: typeof analysisRow | null = analysisRow;
let failingMethod: string | null = null;
let unhandledRejections: unknown[] = [];

const calledMethods = () =>
  vi.mocked(invokeDatabaseFunction).mock.calls.map(([method]) => method);

const onUnhandledRejection = (reason: unknown) => {
  unhandledRejections.push(reason);
};

// runAnalysis does not await its log writes or the last_run update.
const settleBackgroundWrites = () =>
  new Promise((resolve) => setImmediate(resolve));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  storedAnalysis = analysisRow;
  failingMethod = null;
  unhandledRejections = [];
  process.on("unhandledRejection", onUnhandledRejection);
});

afterEach(async () => {
  await settleBackgroundWrites();
  process.off("unhandledRejection", onUnhandledRejection);
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe("runAnalysis", () => {
  test("starts the script without loading the analysis logs", async () => {
    await runAnalysis(ANALYSIS_ID, { variable: "temperature" });

    expect(calledMethods()).toContain("getAnalysisInfo");
    expect(calledMethods()).not.toContain("getAnalysisLogs");
    expect(spawn).toHaveBeenCalledWith(
      analysisRow.binary_path,
      [],
      expect.objectContaining({
        env: expect.objectContaining({
          T_ANALYSIS_ID: ANALYSIS_ID,
          T_ANALYSIS_ENV: JSON.stringify(analysisRow.variables),
        }),
      }),
    );
  });

  test("does not start a deactivated analysis", async () => {
    storedAnalysis = { ...analysisRow, active: false };

    await runAnalysis(ANALYSIS_ID, {});

    expect(spawn).not.toHaveBeenCalled();
    expect(calledMethods()).not.toContain("getAnalysisLogs");
  });

  test("rejects an unknown analysis ID", async () => {
    storedAnalysis = null;

    await expect(runAnalysis(ANALYSIS_ID, {})).rejects.toThrow(
      "Invalid Analysis ID",
    );
    expect(spawn).not.toHaveBeenCalled();
  });

  test("logs a rejected log write without an unhandled rejection", async () => {
    failingMethod = "addAnalysisLog";

    await runAnalysis(ANALYSIS_ID, {});
    await settleBackgroundWrites();

    expect(logError).toHaveBeenCalledWith(
      "api",
      `Analysis ${ANALYSIS_ID}: could not save a log: Database connection is not active`,
    );
    expect(unhandledRejections).toEqual([]);
  });

  test("logs a rejected last_run update without an unhandled rejection", async () => {
    failingMethod = "editAnalysis";

    await runAnalysis(ANALYSIS_ID, {});
    await settleBackgroundWrites();

    expect(logError).toHaveBeenCalledWith(
      "api",
      `Analysis ${ANALYSIS_ID}: could not update last_run: Database connection is not active`,
    );
    expect(unhandledRejections).toEqual([]);
  });
});
