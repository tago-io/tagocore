import {
  render,
  renderWithEvents,
  screen,
} from "../../../utils/test-utils.tsx";
import Switch from "./Switch.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Switch />);
  expect(fn).not.toThrowError();
});

test("uses `✓` by default as selected text", () => {
  render(<Switch value />);
  expect(screen.getByText("✓")).toBeInTheDocument();
});

test("uses `✓` by default as unselected text", () => {
  render(<Switch value={false} />);
  expect(screen.getByText("✕")).toBeInTheDocument();
});

test("respects `selectedText` prop", () => {
  render(<Switch value selectedText="On" />);
  expect(screen.getByText("On")).toBeInTheDocument();
});

test("respects `unselectedText` prop", () => {
  render(<Switch value={false} unselectedText="Off" />);
  expect(screen.getByText("Off")).toBeInTheDocument();
});

test("calls onChange", async () => {
  const onChange = vi.fn();
  const { container, user } = renderWithEvents(<Switch onChange={onChange} />);
  await user.click(container.firstChild as HTMLElement);
  expect(onChange).toHaveBeenLastCalledWith(true);
});

test("doesn't call onChange if it's undefined", async () => {
  const onChange = vi.fn();
  const { container, user } = renderWithEvents(<Switch />);
  await user.click(container.firstChild as HTMLElement);
  expect(onChange).not.toHaveBeenCalled();
});

test("renders children", () => {
  render(<Switch>Hello world</Switch>);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});
