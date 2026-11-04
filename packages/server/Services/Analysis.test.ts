import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../Plugins/invokeDatabaseFunction.ts", () => ({
  invokeDatabaseFunction: vi.fn(async (method: string) => {
    switch (method) {
      case "getAnalysisInfo":
        return storedAnalysis && { ...storedAnalysis };
      case "getAnalysisLogs":
        return storedLogs;
      default:
        return undefined;
    }
  }),
}));

import {
  getAnalysisInfo,
  getAnalysisRunInfo,
  validateAnalysisID,
} from "./Analysis.ts";

const ANALYSIS_ID = "6372d4a0f1c2b3a4d5e6f708";

const analysisRow = {
  id: ANALYSIS_ID,
  name: "Hello world",
  active: true,
  binary_path: "/usr/local/bin/node",
  file_path: "analysis.js",
  tags: [],
  variables: [],
  created_at: new Date(),
  last_run: null,
  updated_at: null,
};

const storedLogs = [
  { timestamp: new Date(), message: "Starting analysis", error: false },
  { timestamp: new Date(), message: "Script failed", error: true },
];

let storedAnalysis: typeof analysisRow | null = analysisRow;

afterEach(() => {
  storedAnalysis = analysisRow;
  vi.clearAllMocks();
});

describe("getAnalysisInfo", () => {
  test("returns the analysis with its console logs", async () => {
    const analysis = await getAnalysisInfo(ANALYSIS_ID);

    expect(analysis.id).toBe(ANALYSIS_ID);
    expect(analysis.console).toEqual(storedLogs);
  });
});

describe("unknown analysis ID", () => {
  test.each([
    ["getAnalysisInfo", getAnalysisInfo],
    ["getAnalysisRunInfo", getAnalysisRunInfo],
    ["validateAnalysisID", validateAnalysisID],
  ])("%s throws Invalid Analysis ID", async (_, lookup) => {
    storedAnalysis = null;

    await expect(lookup(ANALYSIS_ID)).rejects.toThrow("Invalid Analysis ID");
  });
});
