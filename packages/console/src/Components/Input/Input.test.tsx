import { createRef } from "react";
import { fireEvent, render, screen } from "../../../utils/test-utils";
import Input from "./Input.tsx";

test("renders without crashing", async () => {
  const fn = () => render(<Input />);
  expect(fn).not.toThrowError();
});

test("sets ref correctly", async () => {
  const ref = createRef<HTMLInputElement>();
  expect(ref.current).toBeFalsy();
  render(<Input ref={ref} />);
  expect(ref.current).toBeTruthy();
});

test("calls onChange correctly", async () => {
  const onChange = vi.fn();
  render(<Input onChange={onChange} />);

  const input = await screen.findByRole("textbox");
  fireEvent.change(input, { target: { value: "Hello world" } });

  expect(onChange).toHaveBeenCalled();
  expect(onChange.mock.calls[0][0].target.value).toEqual("Hello world");
});

test("passes value prop to inner DOM node", async () => {
  render(<Input value="Hello world" readOnly />);
  const input = (await screen.findByRole("textbox")) as HTMLInputElement;
  expect(input.value).toEqual("Hello world");
});

test("passes readOnly prop to inner DOM node", async () => {
  render(<Input readOnly />);
  const input = (await screen.findByRole("textbox")) as HTMLInputElement;
  expect(input.readOnly).toBeTruthy();
});

test("passes disabled prop to inner DOM node", async () => {
  render(<Input disabled />);
  const input = (await screen.findByRole("textbox")) as HTMLInputElement;
  expect(input.disabled).toBeTruthy();
});
