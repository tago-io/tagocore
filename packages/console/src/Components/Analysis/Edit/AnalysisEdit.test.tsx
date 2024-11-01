vi.mock("../../../Helpers/useApiRequest.ts");
vi.mock("../../../System/Socket.ts");

import { vi } from "vitest";
import { render } from "../../../../utils/test-utils.tsx";
import AnalysisEdit from "./AnalysisEdit.tsx";

test("renders without crashing", () => {
  render(<AnalysisEdit />);
});
