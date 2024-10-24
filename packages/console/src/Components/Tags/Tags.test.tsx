import { fireEvent, render, screen } from "../../../utils/test-utils";
import Tags from "./Tags.tsx";

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

  render(
    <Tags data={[{ key: "city", value: "Raleigh" }]} onChange={onChange} />,
  );

  const inputs = (await screen.findAllByRole("textbox")) as HTMLInputElement[];
  fireEvent.change(inputs[0], { target: { value: "state" } });
  fireEvent.change(inputs[1], { target: { value: "NC" } });

  expect(onChange).toHaveBeenCalledWith([{ key: "state", value: "NC" }]);
});

test("calls onChange when the add row button is pressed", async () => {
  const onChange = vi.fn();
  const emptyObject = { key: "", value: "" };

  render(<Tags data={[emptyObject]} onChange={onChange} />);

  const buttons = (await screen.findAllByRole("button")) as HTMLButtonElement[];
  fireEvent.click(buttons[1]);

  expect(onChange).toHaveBeenCalledWith([emptyObject, emptyObject]);
});
