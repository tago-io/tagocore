import { within } from "@testing-library/react";
import { fireEvent, render, screen } from "../../../utils/test-utils.ts";
import { EIcon } from "../Icon/Icon.types";
import FormGroup from "./FormGroup.tsx";

test("renders without crashing", () => {
  const fn = () => render(<FormGroup />);
  expect(fn).not.toThrowError();
});

test("renders label", () => {
  render(<FormGroup label="Hello world" />);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});

test("renders children", () => {
  render(<FormGroup>Foo</FormGroup>);
  expect(screen.getByText("Foo")).toBeInTheDocument();
});

test("renders icon", () => {
  render(<FormGroup icon={EIcon.cog} />);
  expect(screen.getByText("cog-icon-mock")).toBeInTheDocument();
});

test("respects `style` prop", () => {
  const { container } = render(<FormGroup style={{ background: "red" }} />);
  const style = window.getComputedStyle(container.firstChild as HTMLElement);
  expect(style.backgroundColor).toEqual("red");
});

test("hovering over label with `tooltip` opens tooltip", () => {
  render(<FormGroup label="Hello" tooltip="world" />);
  fireEvent.mouseEnter(screen.getByText("Hello"));
  const tooltip = screen.getByTestId("tooltip");
  expect(tooltip).toBeInTheDocument();
  expect(within(tooltip).getByText("world")).toBeInTheDocument();
});
