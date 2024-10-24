import { render, screen } from "../../../utils/test-utils";
import { EIcon } from "../Icon/Icon.types";
import InnerNav from "./InnerNav.tsx";

/**
 * Default (required) props for the component.
 */
const defaultProps = {
  icon: EIcon.cog,
  title: "",
};

test("renders without crashing", () => {
  const fn = () => render(<InnerNav {...defaultProps} />);
  expect(fn).not.toThrowError();
});

test("renders title", () => {
  render(<InnerNav {...defaultProps} title="Hello world" />);
  expect(screen.getByText("Hello world")).toBeInTheDocument();
});

test("renders icon", async () => {
  render(<InnerNav {...defaultProps} icon={EIcon.device} />);
  expect(await screen.findByTestId("svg-device")).toBeInTheDocument();
});

test("renders description", () => {
  render(<InnerNav {...defaultProps} description="Foo" />);
  expect(screen.getByText("Foo")).toBeInTheDocument();
});

test("renders children", () => {
  render(<InnerNav {...defaultProps}>Page Content</InnerNav>);
  expect(screen.getByText("Page Content")).toBeInTheDocument();
});
