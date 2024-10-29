vi.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils";
import BucketEdit from "./BucketEdit.tsx";

test("renders without crashing", () => {
  render(<BucketEdit />);
});
