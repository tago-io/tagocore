import { render } from "../../../utils/test-utils.ts";
import Loading from "./Loading.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Loading />);
  expect(fn).not.toThrowError();
});
