import { render, screen } from "../../../utils/test-utils.ts";
import Select from "./Select.tsx";

describe("Select", () => {
  it("renders without crashing", async () => {
    const fn = () => render(<Select options={[]} />);
    expect(fn).not.toThrowError();
  });

  it("renders a single <option /> for each item in the options array", async () => {
    render(
      <Select
        options={[
          { label: "Type", value: "type" },
          { label: "Name", value: "name" },
        ]}
      />
    );
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(2);
  });
});
