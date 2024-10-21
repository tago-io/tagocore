import { render, screen } from "../../../utils/test-utils.ts";
import { EIcon } from "../Icon/Icon.types";
import FormDivision from "./FormDivision.tsx";

test("renders without crashing", () => {
  const fn = () => render(<FormDivision />);
  expect(fn).not.toThrowError();
});

test("renders title as string", () => {
  render(<FormDivision title="Settings" />);
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("renders title as node", () => {
  render(<FormDivision title={<div>Settings</div>} />);
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("renders description as string", () => {
  render(<FormDivision description="Adjust the settings" />);
  expect(screen.getByText("Adjust the settings")).toBeInTheDocument();
});

test("renders icon", () => {
  render(<FormDivision icon={EIcon.cog} />);
  expect(screen.getByText("cog-icon-mock")).toBeInTheDocument();
});

test("renders description as node", () => {
  render(<FormDivision description={<div>Adjust the settings</div>} />);
  expect(screen.getByText("Adjust the settings")).toBeInTheDocument();
});

test("respects `renderBorder` prop", () => {
  const { container } = render(<FormDivision renderBorder />);
  const style = window.getComputedStyle(container.firstChild as HTMLElement);
  expect(style.paddingTop).toEqual("1rem");
});
