import { render, screen } from "../../../utils/test-utils.tsx";
import Icon from "./Icon.tsx";
import { EIcon } from "./Icon.types";

test("renders without crashing", () => {
  const fn = () => render(<Icon icon={EIcon.cog} />);
  expect(fn).not.toThrowError();
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

test("respects `color` prop", async () => {
  render(<Icon color="red" icon={EIcon.cog} />);
  const svg = await screen.findByTestId("svg-cog");
  expect(svg.firstChild).toHaveStyle({ fill: "red" });
});
