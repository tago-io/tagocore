import { render, screen } from "../../../utils/test-utils.ts";
import BooleanStatus from "./BooleanStatus.tsx";

test("renders without crashing", () => {
  const fn = () => render(<BooleanStatus />);
  expect(fn).not.toThrowError();
});

test("renders correct text for value = `true`", async () => {
  render(<BooleanStatus value />);
  const text = screen.getByText("Yes");
  expect(text).toBeInTheDocument();
});

test("renders correct text for value = `false`", async () => {
  render(<BooleanStatus value={false} />);
  const text = screen.getByText("No");
  expect(text).toBeInTheDocument();
});
