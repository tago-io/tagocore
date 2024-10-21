jest.mock("../../../Helpers/useApiRequest.ts");
jest.mock("../../../System/Socket.ts");

import { render } from "../../../../utils/test-utils.ts";
import DeviceEdit from "./DeviceEdit.tsx";

test("renders without crashing", () => {
  const fn = () => render(<DeviceEdit />);
  expect(fn).not.toThrowError();
});
