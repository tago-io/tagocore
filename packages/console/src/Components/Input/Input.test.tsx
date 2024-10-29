import { createRef, useState } from "react";
import { render, renderWithEvents, screen } from "../../../utils/test-utils";
import Input, { type IInput } from "./Input.tsx";

function StatefulInput(props: IInput) {
  const [state, setState] = useState("");

  return (
    <Input
      value={state}
      onChange={(e) => {
        setState(e.target.value);
        props.onChange?.(e.target.value);
      }}
    />
  );
}

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
  const { user } = renderWithEvents(<StatefulInput onChange={onChange} />);

  const input = await screen.findByRole("textbox");
  await user.type(input, "Hello world");

  expect(onChange).toHaveBeenLastCalledWith("Hello world");
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
  expect(input).toBeDisabled();
});
