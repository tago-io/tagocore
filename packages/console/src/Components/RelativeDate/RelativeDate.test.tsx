import { render, renderWithEvents, screen } from "../../../utils/test-utils";
import RelativeDate from "./RelativeDate.tsx";

test("renders without crashing", () => {
  const fn = () => render(<RelativeDate value={null} />);
  expect(fn).not.toThrowError();
});

test("renders correct output for `null`", () => {
  render(<RelativeDate value={null} />);
  expect(screen.getByText("Never")).toBeInTheDocument();
});

test("renders correct output for `undefined`", () => {
  render(<RelativeDate value={undefined} />);
  expect(screen.getByText("Never")).toBeInTheDocument();
});

test("renders correct output for right now", () => {
  render(<RelativeDate value={Date.now()} />);
  expect(screen.getByText("a few seconds ago")).toBeInTheDocument();
});

test("renders correct output for 10 seconds ago", () => {
  const someTimeAgo = Date.now() - 10 * 1000;
  render(<RelativeDate value={someTimeAgo} />);
  expect(screen.getByText("10 seconds ago")).toBeInTheDocument();
});

test("renders correct output for 5 minutes ago", () => {
  const someTimeAgo = Date.now() - 5 * 1000 * 60;
  render(<RelativeDate value={someTimeAgo} />);
  expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
});

test("text shows same string with `useInputStyle` prop", () => {
  const someTimeAgo = Date.now() - 5 * 1000 * 60;
  render(<RelativeDate useInputStyle value={someTimeAgo} />);
  expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
});

test("hovering over text opens tooltip", async () => {
  const someTimeAgo = Date.now() - 5 * 1000 * 60;
  const { user } = renderWithEvents(<RelativeDate value={someTimeAgo} />);
  await user.hover(screen.getByText("5 minutes ago"));
  expect(screen.queryByTestId("tooltip")).toBeInTheDocument();
});

test("hovering over text with `useInputStyle` opens tooltip", async () => {
  const { user } = renderWithEvents(
    <RelativeDate useInputStyle value={Date.now()} />,
  );
  await user.hover(screen.getByText("a few seconds ago"));
  expect(screen.queryByTestId("tooltip")).toBeInTheDocument();
});

test("hovering over `Never` does nothing", async () => {
  const { user } = renderWithEvents(<RelativeDate value={null} />);
  expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
  await user.hover(screen.getByText("Never"));
  expect(screen.queryByTestId("tooltip")).not.toBeInTheDocument();
});
