import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("../Helpers/log.ts", () => ({
  logError: vi.fn(),
}));

vi.mock("../Plugins/invokeDatabaseFunction.ts", () => ({
  invokeDatabaseFunction: vi.fn(),
}));

import { logError } from "../Helpers/log.ts";
import { invokeDatabaseFunction } from "../Plugins/invokeDatabaseFunction.ts";
import {
  getAnalysisLogMaxLines,
  startAnalysisLogRetentionTimer,
  stopAnalysisLogRetentionTimer,
  triggerAnalysisLogRetentionCheck,
} from "./AnalysisLogRetention.ts";

const RETENTION_INTERVAL = 1000 * 60 * 10;

const analysisRows = [
  { id: "6372d4a0f1c2b3a4d5e6f701", tags: [] },
  { id: "6372d4a0f1c2b3a4d5e6f702", tags: [] },
  { id: "6372d4a0f1c2b3a4d5e6f703", tags: [] },
];

const invokeMock = vi.mocked(invokeDatabaseFunction);

/**
 * Mocks the database plugin: lists `analysisRows` and runs `applyRetention` for each retention call.
 */
function mockDatabase(applyRetention: () => Promise<void> = async () => {}) {
  invokeMock.mockImplementation(async (method: string) => {
    if (method === "getAnalysisList") {
      return analysisRows;
    }
    if (method === "applyAnalysisLogRetention") {
      return applyRetention();
    }
    return undefined;
  });
}

function getCalls(method: string) {
  return invokeMock.mock.calls.filter(([name]) => name === method);
}

beforeEach(() => {
  vi.useFakeTimers();
  mockDatabase();
});

afterEach(() => {
  stopAnalysisLogRetentionTimer();
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("analysis log retention timer", () => {
  test("calls applyAnalysisLogRetention once per analysis with max_lines 1000 when the variable is unset", async () => {
    vi.stubEnv("TCORE_ANALYSIS_LOG_MAX_LINES", undefined);

    startAnalysisLogRetentionTimer(getAnalysisLogMaxLines());
    await vi.advanceTimersByTimeAsync(RETENTION_INTERVAL);

    expect(getCalls("applyAnalysisLogRetention")).toEqual(
      analysisRows.map((analysis) => [
        "applyAnalysisLogRetention",
        analysis.id,
        { max_lines: 1000 },
      ]),
    );
  });

  test("uses max_lines 250 when the variable is 250", async () => {
    vi.stubEnv("TCORE_ANALYSIS_LOG_MAX_LINES", "250");

    startAnalysisLogRetentionTimer(getAnalysisLogMaxLines());
    await vi.advanceTimersByTimeAsync(RETENTION_INTERVAL);

    expect(getCalls("applyAnalysisLogRetention")).toEqual(
      analysisRows.map((analysis) => [
        "applyAnalysisLogRetention",
        analysis.id,
        { max_lines: 250 },
      ]),
    );
  });

  test("does not run a cycle before the interval elapses", async () => {
    startAnalysisLogRetentionTimer(1000);
    await vi.advanceTimersByTimeAsync(RETENTION_INTERVAL - 1);

    expect(invokeMock).not.toHaveBeenCalled();
  });
});

describe("getAnalysisLogMaxLines", () => {
  test.each(["abc", "0", "-5", "2.5", ""])(
    "fails startup naming the variable when it is %j",
    (value) => {
      vi.stubEnv("TCORE_ANALYSIS_LOG_MAX_LINES", value);

      expect(() => getAnalysisLogMaxLines()).toThrow(
        "TCORE_ANALYSIS_LOG_MAX_LINES",
      );
    },
  );
});

describe("triggerAnalysisLogRetentionCheck", () => {
  test.each([
    "Method not implemented",
    "Function applyAnalysisLogRetention is not implemented",
  ])(
    "skips the cycle without logging an error when the plugin throws %j",
    async (message) => {
      mockDatabase(async () => {
        throw new Error(message);
      });

      await triggerAnalysisLogRetentionCheck(1000);

      expect(getCalls("applyAnalysisLogRetention")).toHaveLength(1);
      expect(logError).not.toHaveBeenCalled();
    },
  );

  test("logs any other error", async () => {
    mockDatabase(async () => {
      throw new Error("Connection terminated");
    });

    await triggerAnalysisLogRetentionCheck(1000);

    expect(logError).toHaveBeenCalledOnce();
    expect(vi.mocked(logError).mock.calls[0].join(" ")).toContain(
      "Connection terminated",
    );
  });

  test("does not start a cycle while another one is running", async () => {
    let release: () => void = () => {};
    const blocked = new Promise<void>((resolve) => {
      release = resolve;
    });
    mockDatabase(() => blocked);

    const firstCycle = triggerAnalysisLogRetentionCheck(1000);
    const secondCycle = triggerAnalysisLogRetentionCheck(1000);
    release();
    await Promise.all([firstCycle, secondCycle]);

    expect(getCalls("getAnalysisList")).toHaveLength(1);
    expect(getCalls("applyAnalysisLogRetention")).toHaveLength(
      analysisRows.length,
    );
  });
});
