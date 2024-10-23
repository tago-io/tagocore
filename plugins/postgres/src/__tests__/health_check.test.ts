import axios from "axios";
import { it, expect, describe } from "vitest";

describe("Test", () => {
  it("should pass", async () => {
    const result = await axios.get("/status");

    expect(result.data).toMatchObject({ status: true });
  });
});
