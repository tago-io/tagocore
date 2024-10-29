vi.mock("../../../Helpers/useApiRequest.ts");
vi.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils";
import AnalysisEdit from "./AnalysisEdit.tsx";

test("renders without crashing", () => {
  render(<AnalysisEdit />);
});
