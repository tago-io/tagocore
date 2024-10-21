jest.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils.ts";
import BucketEdit from "./BucketEdit.tsx";

test("renders without crashing", () => {
  const fn = () => render(<BucketEdit />);
  expect(fn).not.toThrowError();
});
