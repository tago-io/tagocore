import { fireEvent, render, screen } from "../../../utils/test-utils.ts";
import Button from "./Button.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Button />);
  expect(fn).not.toThrowError();
});

test("calls onClick", () => {
  const fn = jest.fn();
  render(<Button onClick={fn} />);
  fireEvent.click(screen.getByRole("button"));
  expect(fn).toHaveBeenCalled();
});

test("renders children inside of button", () => {
  render(<Button>Hello world</Button>);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});

test("passes className to inner DOM node", () => {
  render(<Button className="sidebar-button" />);
  expect(screen.getByRole("button")).toHaveClass("sidebar-button");
});

test("passes disabled prop to inner DOM node", () => {
  render(<Button disabled />);
  expect(screen.getByRole("button")).toBeDisabled();
});

test("respects color prop", () => {
  render(<Button color="red" />);
  const button = screen.getByRole("button");
  const style = window.getComputedStyle(button);
  expect(style.backgroundColor).toEqual("red");
});
