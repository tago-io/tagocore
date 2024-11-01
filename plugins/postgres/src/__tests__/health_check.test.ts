import axios from "axios";
import { describe, expect, it } from "vitest";

describe("Test", () => {
  it("should pass", async () => {
    const result = await axios.get("/status");

    expect(result.data).toMatchObject({ status: true });
  });
});
