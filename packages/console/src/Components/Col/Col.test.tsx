import { render, screen } from "../../../utils/test-utils.ts";
import Col from "./Col.tsx";

describe("Just a test", () => {
  test("1", async () => {
    render(
      <Col>
        <span>Hello world</span>
      </Col>
    );
    const item = await screen.findAllByText("Hello world");
    expect(item).toHaveLength(1);
  });

  test("2", async () => {
    render(
      <Col>
        <span>Testing</span>
      </Col>
    );
    const item = await screen.findAllByText("Testing");
    expect(item).toHaveLength(1);
  });
});
