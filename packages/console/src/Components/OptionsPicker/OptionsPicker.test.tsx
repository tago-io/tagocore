import { fireEvent, render, screen } from "../../../utils/test-utils.ts";
import OptionsPicker from "./OptionsPicker.tsx";

const defaultProps = {
  onGetOptions: jest.fn().mockImplementation(() => []),
  onRenderOption: jest.fn(),
  onChange: jest.fn(),
};

test("renders without crashing", () => {
  const fn = () => render(<OptionsPicker {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders input", () => {
  render(<OptionsPicker {...defaultProps} />);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("opens options when focusing input", () => {
  render(<OptionsPicker {...defaultProps} />);
  fireEvent.focus(screen.getByRole("textbox"));
  expect(screen.getByTestId("options")).toBeInTheDocument();
});

test("respects `placeholder` prop", () => {
  render(<OptionsPicker {...defaultProps} placeholder="Hello" />);
  expect(screen.getByRole("textbox")).toHaveProperty("placeholder", "Hello");
});

test("renders correct icon with no value", () => {
  render(<OptionsPicker {...defaultProps} />);
  expect(screen.getByText("caret-down-icon-mock")).toBeInTheDocument();
});

test("renders correct icon with value", () => {
  render(<OptionsPicker<any> {...defaultProps} value={{}} />);
  expect(screen.getByText("times-icon-mock")).toBeInTheDocument();
});

test("clears value when clicking on the clear button", () => {
  const onChange = jest.fn();
  render(<OptionsPicker {...defaultProps} onChange={onChange} value={{}} />);
  fireEvent.click(screen.getByText("times-icon-mock"));
  expect(onChange).toHaveBeenCalledWith(null);
});

test("calls onChange when selecting option", () => {
  const onChange = jest.fn();
  render(<OptionsPicker {...defaultProps} onChange={onChange} value={{}} />);
  fireEvent.click(screen.getByText("times-icon-mock"));
  expect(onChange).toHaveBeenCalledWith(null);
});
