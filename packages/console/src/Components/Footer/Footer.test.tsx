import { render, screen } from "../../../utils/test-utils.tsx";
import Footer from "./Footer.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Footer />);
  expect(fn).not.toThrowError();
});

test("renders children", () => {
  render(<Footer>Hello world</Footer>);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});
