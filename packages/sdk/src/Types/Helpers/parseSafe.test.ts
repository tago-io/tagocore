import { parseSafe } from "./parseSafe.ts";

describe("parseSafe", () => {
  test("assure correct parsing", () => {
    const data = '{"value":1}';
    const process = parseSafe(data);
    expect(process).toStrictEqual({ value: 1 });
  });

  test("exception catching", () => {
    const data = 0;
    const process = parseSafe(data);
    expect(process).toStrictEqual({});
  });
});
