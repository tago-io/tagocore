import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { up as addAnalysisLogIndex } from "./Migrations/20261104170000_1.0.4.ts";
import getAnalysisLogs from "./Providers/Analysis/getAnalysisLogs.ts";
import { destroyKnex, knexClient, setupKnex } from "./knex.ts";

beforeAll(async () => {
  await setupKnex({ file: ":memory:" });
});

afterAll(async () => {
  await destroyKnex();
});

describe("analysis_log index", () => {
  test("the console query searches analysis_log through the index", async () => {
    let query: { sql: string; bindings: unknown[] } | undefined;
    const capture = (data: { sql: string; bindings: unknown[] }) => {
      query = data;
    };

    knexClient.on("query", capture);
    await getAnalysisLogs("analysis-id");
    knexClient.off("query", capture);

    expect(query?.sql).toMatch(/order by .timestamp. desc limit/i);

    const plan = await knexClient.raw(
      `EXPLAIN QUERY PLAN ${query?.sql}`,
      query?.bindings as any[],
    );
    const details = plan.map((row: { detail: string }) => row.detail);

    expect(details).toContainEqual(
      expect.stringMatching(
        /^SEARCH analysis_log USING INDEX analysis_log_analysis_id_timestamp_index/,
      ),
    );
    expect(details).not.toContainEqual(expect.stringMatching(/TEMP B-TREE/));
  });

  test("applying the index migration a second time succeeds", async () => {
    await expect(addAnalysisLogIndex(knexClient)).resolves.toBeUndefined();

    const indexes = await knexClient("sqlite_master")
      .where({ type: "index", tbl_name: "analysis_log" })
      .pluck("name");

    expect(indexes).toEqual(["analysis_log_analysis_id_timestamp_index"]);
  });
});
