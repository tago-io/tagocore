jest.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils.ts";
import ActionEdit from "./ActionEdit.tsx";

test("renders without crashing", () => {
  const fn = () => render(<ActionEdit />);
  expect(fn).not.toThrowError();
});
