import { render } from "../../../utils/test-utils";
import FlexRow from "./FlexRow.tsx";

test("renders without crashing", () => {
  const fn = () => render(<FlexRow />);
  expect(fn).not.toThrowError();
});
