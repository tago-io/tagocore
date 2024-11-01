import { useState } from "react";
import {
  render,
  renderWithEvents,
  screen,
} from "../../../utils/test-utils.tsx";
import Tags, { type ITags } from "./Tags.tsx";

function StatefulTags(props: ITags) {
  const [state, setState] = useState<ITags["data"]>(props.data ?? []);

  return (
    <Tags
      data={state}
      onChange={(updatedTags) => {
        setState(updatedTags);
        props.onChange?.(updatedTags);
      }}
    />
  );
}

test("renders without crashing", () => {
  const fn = () => render(<Tags data={[]} onChange={vi.fn()} />);
  expect(fn).not.toThrow();
});

test("renders inputs with correct properties", async () => {
  render(
    <Tags
      data={[
        { key: "city", value: "Raleigh" },
        { key: "type", value: "internal" },
      ]}
      onChange={vi.fn()}
    />,
  );
  const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
  expect(inputs).toHaveLength(4);
  expect(inputs[0].value).toEqual("city");
  expect(inputs[1].value).toEqual("Raleigh");

  expect(inputs[2].value).toEqual("type");
  expect(inputs[3].value).toEqual("internal");
});

test("calls onChange when any input change happens", async () => {
  const onChange = vi.fn();
  const { user } = renderWithEvents(
    <StatefulTags
      data={[{ key: "city", value: "Raleigh" }]}
      onChange={onChange}
    />,
  );

  const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
  await user.clear(inputs[0]);
  await user.type(inputs[0], "state");
  await user.clear(inputs[1]);
  await user.type(inputs[1], "NC");

  expect(onChange).toHaveBeenLastCalledWith([{ key: "state", value: "NC" }]);
});

test("calls onChange when the add row button is pressed", async () => {
  const onChange = vi.fn();
  const emptyObject = { key: "", value: "" };

  const { user } = renderWithEvents(
    <Tags data={[emptyObject]} onChange={onChange} />,
  );

  const buttons = (await screen.findAllByRole("button")) as HTMLButtonElement[];
  await user.click(buttons[1]);

  expect(onChange).toHaveBeenCalledWith([emptyObject, emptyObject]);
});

test("calls onChange when a new tag is added", async () => {
  const onChange = vi.fn();
  const { user } = renderWithEvents(
    <StatefulTags
      data={[{ key: "city", value: "Raleigh" }]}
      onChange={onChange}
    />,
  );

  const buttons = (await screen.findAllByRole("button")) as HTMLButtonElement[];
  await user.click(buttons[1]);

  const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
  await user.clear(inputs[2]);
  await user.type(inputs[2], "state");
  await user.clear(inputs[3]);
  await user.type(inputs[3], "NC");

  expect(onChange).toHaveBeenLastCalledWith([
    { key: "city", value: "Raleigh" },
    { key: "state", value: "NC" },
  ]);
});
