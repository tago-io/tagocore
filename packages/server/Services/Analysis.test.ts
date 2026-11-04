import { afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../Plugins/invokeDatabaseFunction.ts", () => ({
  invokeDatabaseFunction: vi.fn(async (method: string) => {
    switch (method) {
      case "getAnalysisInfo":
        return { ...analysisRow };
      case "getAnalysisLogs":
        return storedLogs;
      default:
        return undefined;
    }
  }),
}));

import { getAnalysisInfo } from "./Analysis.ts";

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

afterEach(() => {
  vi.clearAllMocks();
});

describe("getAnalysisInfo", () => {
  test("returns the analysis with its console logs", async () => {
    const analysis = await getAnalysisInfo(ANALYSIS_ID);

    expect(analysis.id).toBe(ANALYSIS_ID);
    expect(analysis.console).toEqual(storedLogs);
  });
});
