import { render, screen } from "../../../utils/test-utils";
import { renderWithEvents } from "../../../utils/test-utils.tsx";
import { waitFor } from "@testing-library/react";
import OptionsPicker from "./OptionsPicker.tsx";

const defaultProps = {
  onGetOptions: vi.fn().mockImplementation(() => []),
  onRenderOption: vi.fn(),
  onChange: vi.fn(),
};

test("renders without crashing", () => {
  const fn = () => render(<OptionsPicker {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders input", () => {
  render(<OptionsPicker {...defaultProps} />);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
});

test("opens options when focusing input", async () => {
  const { user } = renderWithEvents(<OptionsPicker {...defaultProps} />);
  await user.click(screen.getByRole("textbox"));
  await waitFor(() =>
    expect(screen.getByTestId("options")).toBeInTheDocument(),
  );
});

test("respects `placeholder` prop", () => {
  render(<OptionsPicker {...defaultProps} placeholder="Hello" />);
  expect(screen.getByRole("textbox")).toHaveProperty("placeholder", "Hello");
});

test("renders correct icon with no value", async () => {
  render(<OptionsPicker {...defaultProps} />);
  expect(await screen.findByTestId("svg-caret-down")).toBeInTheDocument();
});

test("renders correct icon with value", async () => {
  render(<OptionsPicker<any> {...defaultProps} value={{}} />);
  expect(await screen.findByTestId("svg-times")).toBeInTheDocument();
});

test("clears value when clicking on the clear button", async () => {
  const onChange = vi.fn();
  const { user } = renderWithEvents(
    <OptionsPicker {...defaultProps} onChange={onChange} value={{}} />,
  );
  await user.click(await screen.findByTestId("svg-times"));
  expect(onChange).toHaveBeenCalledWith(null);
});

test("calls onChange when selecting option", async () => {
  const onChange = vi.fn();
  const { user } = renderWithEvents(
    <OptionsPicker {...defaultProps} onChange={onChange} value={{}} />,
  );
  await user.click(await screen.findByTestId("svg-times"));
  expect(onChange).toHaveBeenCalledWith(null);
});
