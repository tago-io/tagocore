import { within } from "@testing-library/react";
import { fireEvent, render, screen } from "../../../utils/test-utils.ts";
import { EIcon } from "../Icon/Icon.types";
import IconRadio from "./IconRadio.tsx";

/**
 * Default (required) props for the component.
 */
const defaultProps = {
  value: "",
  options: [],
  onChange: jest.fn(),
};

test("renders without crashing", () => {
  const fn = () => render(<IconRadio {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders simple option", () => {
  const options = [{ icon: EIcon.cog, label: "Hello", value: "world" }];
  render(<IconRadio {...defaultProps} options={options} />);

  const option = screen.getByTestId("option-world");
  expect(within(option).getByText("Hello")).toBeInTheDocument();
  expect(within(option).getByText("cog-icon-mock")).toBeInTheDocument();
});

test("renders detailed option", () => {
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

  const svg = screen.getByText("home-icon-mock");
  const style = window.getComputedStyle(svg);
  expect(style.fill).toEqual("red");
});

test("doesn't call onChange if the option is disabled", () => {
  const onChange = jest.fn();
  const options = [{ icon: EIcon.cog, disabled: true, label: "Hello", value: "world" }];
  render(<IconRadio {...defaultProps} options={options} onChange={onChange} />);
  fireEvent.click(screen.getByTestId("option-world"));
  expect(onChange).toHaveBeenCalledWith("world");
});

test("calls onChange when an option is clicked", () => {
  const onChange = jest.fn();
  const options = [{ icon: EIcon.cog, label: "Hello", value: "world" }];
  render(<IconRadio {...defaultProps} options={options} onChange={onChange} />);
  fireEvent.click(screen.getByTestId("option-world"));
  expect(onChange).toHaveBeenCalledWith("world");
});
