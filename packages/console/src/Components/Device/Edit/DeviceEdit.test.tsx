vi.mock("../../../Helpers/useApiRequest.ts");
vi.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils";
import DeviceEdit from "./DeviceEdit.tsx";

test("renders without crashing", () => {
  render(<DeviceEdit />);
});
