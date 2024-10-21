import { refineOrderBy } from "./refineOrderBy.ts";

describe("refineOrderBy", () => {
  test("assure correct validation", () => {
    const data = "asc";
    const process = refineOrderBy(data);
    expect(process).toBeTruthy();
  });
});
