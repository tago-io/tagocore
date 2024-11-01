import { within } from "@testing-library/react";
import { vi } from "vitest";
import {
  render,
  renderWithEvents,
  screen,
} from "../../../utils/test-utils.tsx";
import { EIcon } from "../Icon/Icon.types";
import IconRadio from "./IconRadio.tsx";

const onChangeFn = vi.fn();

const defaultProps = {
  value: "",
  options: [],
  onChange: onChangeFn,
};

beforeEach(() => {
  onChangeFn.mockClear();
});

test("renders without crashing", () => {
  const fn = () => render(<IconRadio {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders simple option", async () => {
  const options = [{ icon: EIcon.cog, label: "Hello", value: "world" }];
  render(<IconRadio {...defaultProps} options={options} />);

  const option = screen.getByTestId("option-world");
  expect(within(option).getByText("Hello")).toBeInTheDocument();
  expect(await within(option).findByTestId("svg-cog")).toBeInTheDocument();
});

test("renders detailed option", async () => {
  const options = [
    {
      icon: EIcon.home,
      color: "red",
      description: "I work remotely",
      label: "Remote",
      value: "remote",
    },
  ];
  render(<IconRadio {...defaultProps} options={options} />);
  const remote = screen.getByTestId("option-remote");
  expect(within(remote).getByText("I work remotely")).toBeInTheDocument();
  expect(within(remote).getByText("Remote")).toBeInTheDocument();

  const svg = await screen.findByTestId("svg-home");
  expect(svg.firstChild).toHaveStyle({ fill: "red" });
});

test("doesn't call onChange if the option is disabled", async () => {
  const options = [
    { icon: EIcon.cog, disabled: true, label: "Hello", value: "world" },
  ];
  const { user } = renderWithEvents(
    <IconRadio {...defaultProps} options={options} />,
  );

  await expect(() =>
    user.click(screen.getByTestId("option-world")),
  ).rejects.toThrowError();
  expect(onChangeFn).not.toHaveBeenCalled();
});

test("calls onChange when an option is clicked", async () => {
  const options = [{ icon: EIcon.cog, label: "Hello", value: "world" }];
  const { user } = renderWithEvents(
    <IconRadio {...defaultProps} options={options} />,
  );
  await user.click(screen.getByTestId("option-world"));
  expect(onChangeFn).toHaveBeenCalledWith("world");
});
