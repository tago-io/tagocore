vi.mock("../../../Helpers/useApiRequest.ts");

import { vi } from "vitest";
import { render } from "../../../../utils/test-utils.tsx";
import BucketEdit from "./BucketEdit.tsx";

test("renders without crashing", () => {
  render(<BucketEdit />);
});
