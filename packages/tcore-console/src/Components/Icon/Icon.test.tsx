import { render, screen } from "../../../utils/test-utils";
import Icon from "./Icon";
import { EIcon } from "./Icon.types";

test("renders without crashing", () => {
  const fn = () => render(<Icon icon={EIcon.cog} />);
  expect(fn).not.toThrowError();
});

test("renders icon data", () => {
  render(<Icon icon={EIcon.cog} />);
  expect(screen.getByText("cog-icon-mock"));
});

test("has correct default size", () => {
  const { container } = render(<Icon icon={EIcon.cog} />);
  const style = window.getComputedStyle(container.firstChild as HTMLElement);
  expect(style.width).toEqual("12px");
  expect(style.height).toEqual("12px");
});

test("respects `size` prop", () => {
  const { container } = render(<Icon size="20px" icon={EIcon.cog} />);
  const style = window.getComputedStyle(container.firstChild as HTMLElement);
  expect(style.width).toEqual("20px");
  expect(style.height).toEqual("20px");
});

test("respects `color` prop", () => {
  render(<Icon color="red" icon={EIcon.cog} />);
  const svg = screen.getByText("cog-icon-mock");
  const style = window.getComputedStyle(svg);
  expect(style.fill).toEqual("red");
});
