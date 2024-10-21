import axios from "axios";

describe("Test", () => {
  it("should pass", async () => {
    const result = await axios.get("/status");

    expect(result.data).toMatchObject({ status: true });
  });
});
