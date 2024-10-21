jest.mock("../../../Helpers/useApiRequest.ts");
jest.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils.ts";
import AnalysisEdit from "./AnalysisEdit.tsx";

test("renders without crashing", () => {
  const fn = () => render(<AnalysisEdit />);
  expect(fn).not.toThrowError();
});
