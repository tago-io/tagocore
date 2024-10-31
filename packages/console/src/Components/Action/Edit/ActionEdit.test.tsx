vi.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils";
import ActionEdit from "./ActionEdit.tsx";

test("renders without crashing", () => {
  render(<ActionEdit />);
});
