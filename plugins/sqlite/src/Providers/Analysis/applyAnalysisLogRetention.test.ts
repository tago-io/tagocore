import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { destroyKnex, knexClient, setupKnex } from "../../knex.ts";
import applyAnalysisLogRetention from "./applyAnalysisLogRetention.ts";

const NOW = Date.UTC(2026, 10, 4, 12, 0, 0);

/**
 * Timestamp `seconds` before NOW, in the epoch milliseconds SQLite stores.
 */
const secondsAgo = (seconds: number) => NOW - seconds * 1000;

const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => start + i);

/**
 * Creates an analysis with one log per timestamp; `null` stores a log without one.
 */
async function seedAnalysis(analysisID: string, timestamps: (number | null)[]) {
  await knexClient("analysis").insert({
    id: analysisID,
    name: analysisID,
    active: true,
  });
  const logs = timestamps.map((timestamp, i) => ({
    analysis_id: analysisID,
    timestamp: timestamp === null ? null : new Date(timestamp),
    message: `line ${i}`,
    error: false,
  }));
  await knexClient.batchInsert("analysis_log", logs, 200);
}

/**
 * Timestamps of the logs an analysis still has, newest first, `null` last.
 */
async function keptTimestamps(analysisID: string): Promise<(number | null)[]> {
  const rows: { timestamp: number | null }[] = await knexClient("analysis_log")
    .select("timestamp")
    .where("analysis_id", analysisID);
  return rows
    .map((row) => row.timestamp)
    .sort(
      (a, b) =>
        (b ?? Number.NEGATIVE_INFINITY) - (a ?? Number.NEGATIVE_INFINITY),
    );
}

beforeAll(async () => {
  await setupKnex({ file: ":memory:" });
});

afterAll(async () => {
  await destroyKnex();
});

describe("applyAnalysisLogRetention", () => {
  test("keeps the 1,000 newest logs of each analysis", async () => {
    await seedAnalysis("analysis-a", range(0, 1200).map(secondsAgo));
    await seedAnalysis("analysis-b", range(0, 50).map(secondsAgo));

    await applyAnalysisLogRetention("analysis-a", { max_lines: 1000 });
    await applyAnalysisLogRetention("analysis-b", { max_lines: 1000 });

    expect(await keptTimestamps("analysis-a")).toEqual(
      range(0, 1000).map(secondsAgo),
    );
    expect(await keptTimestamps("analysis-b")).toEqual(
      range(0, 50).map(secondsAgo),
    );
  });

  test("deletes logs without a timestamp before any log that has one", async () => {
    const timestamps = range(0, 1000).map(secondsAgo);
    await seedAnalysis("analysis-nulls", [null, ...timestamps, null, null]);

    await applyAnalysisLogRetention("analysis-nulls", { max_lines: 1000 });

    expect(await keptTimestamps("analysis-nulls")).toEqual(timestamps);
  });

  test("keeps every log that shares the cutoff timestamp", async () => {
    const newest = range(0, 8).map(secondsAgo);
    const cutoff = Array.from({ length: 4 }, () => secondsAgo(8));
    const older = range(9, 12).map(secondsAgo);
    await seedAnalysis("analysis-ties", [...older, ...cutoff, ...newest]);

    await applyAnalysisLogRetention("analysis-ties", { max_lines: 10 });

    expect(await keptTimestamps("analysis-ties")).toEqual([
      ...newest,
      ...cutoff,
    ]);
  });

  test("trims logs without a timestamp to fill max_lines when fewer logs have one", async () => {
    const timestamps = range(0, 5).map(secondsAgo);
    await seedAnalysis("analysis-few", [
      ...timestamps,
      ...Array.from({ length: 20 }, () => null),
    ]);

    await applyAnalysisLogRetention("analysis-few", { max_lines: 10 });

    expect(await keptTimestamps("analysis-few")).toEqual([
      ...timestamps,
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  test("trims more rows than one delete chunk", async () => {
    await seedAnalysis("analysis-large", range(0, 12000).map(secondsAgo));

    await applyAnalysisLogRetention("analysis-large", { max_lines: 1000 });

    expect(await keptTimestamps("analysis-large")).toEqual(
      range(0, 1000).map(secondsAgo),
    );
  });
});
