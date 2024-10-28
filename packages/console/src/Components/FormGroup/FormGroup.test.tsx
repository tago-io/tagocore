import { within } from "@testing-library/react";
import { render, renderWithEvents, screen } from "../../../utils/test-utils";
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

test("renders icon", async () => {
  render(<FormGroup icon={EIcon.cog} />);
  expect(await screen.findByTestId("svg-cog")).toBeInTheDocument();
});

test("respects `style` prop", () => {
  const { container } = render(<FormGroup style={{ background: "red" }} />);
  const style = window.getComputedStyle(container.firstChild as HTMLElement);
  expect(style.backgroundColor).toEqual("rgb(255, 0, 0)");
});

test("hovering over label with `tooltip` opens tooltip", async () => {
  const { user } = renderWithEvents(
    <FormGroup label="Hello" tooltip="world" />,
  );
  await user.hover(screen.getByText("Hello"));
  const tooltip = screen.getByTestId("tooltip");
  expect(tooltip).toBeInTheDocument();
  expect(within(tooltip).getByText("world")).toBeInTheDocument();
});
