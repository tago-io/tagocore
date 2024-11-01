vi.mock("../../../Helpers/useApiRequest.ts");

import { render } from "../../../../utils/test-utils.tsx";
import ActionEdit from "./ActionEdit.tsx";

test("renders without crashing", () => {
  render(<ActionEdit />);
});
