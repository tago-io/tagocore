import { render, renderWithEvents, screen } from "../../../utils/test-utils";
import { EIcon } from "../Icon/Icon.types";
import Accordion from "./Accordion.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Accordion />);
  expect(fn).not.toThrow();
});

vi.mock("../Icon.tsx");

test("doesn't render children if `open` = `false`", () => {
  render(<Accordion>Hello world</Accordion>);
  expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
});

test("renders children if `open` = `true`", () => {
  render(<Accordion open>Hello world</Accordion>);
  expect(screen.queryByText("Hello world")).toBeInTheDocument();
});

test("calls onChangeOpen when clicking on the title bar", async () => {
  const onChangeOpen = vi.fn();
  const { user } = renderWithEvents(
    <Accordion onChangeOpen={onChangeOpen}>Hello world</Accordion>,
  );
  expect(onChangeOpen).not.toHaveBeenCalled();
  await user.click(screen.getByTestId("title-bar"));
  expect(onChangeOpen).toHaveBeenCalled();
});

test("doesn't call onChangeOpen if it's undefined", async () => {
  const { user } = renderWithEvents(<Accordion>Hello world</Accordion>);
  await user.click(screen.getByTestId("title-bar"));
});

test("doesn't call onChangeOpen if `isAlwaysOpen` = `true`", async () => {
  const onChangeOpen = vi.fn();
  const { user } = renderWithEvents(
    <Accordion isAlwaysOpen onChangeOpen={onChangeOpen}>
      Hello world
    </Accordion>,
  );
  expect(onChangeOpen).not.toHaveBeenCalled();
  await user.click(screen.getByTestId("title-bar"));
  expect(onChangeOpen).not.toHaveBeenCalled();
});

test("doesn't call onChangeOpen if clicking on the children", async () => {
  const onChangeOpen = vi.fn();
  const { user } = renderWithEvents(
    <Accordion open onChangeOpen={onChangeOpen}>
      Hello world
    </Accordion>,
  );
  expect(onChangeOpen).not.toHaveBeenCalled();
  await user.click(screen.getByText("Hello world"));
  expect(onChangeOpen).not.toHaveBeenCalled();
});

test("renders title as string", () => {
  render(<Accordion title="Settings" />);
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("renders title as node", () => {
  render(<Accordion title={<div>Settings</div>} />);
  expect(screen.getByText("Settings")).toBeInTheDocument();
});

test("renders description as string", () => {
  render(<Accordion description="Adjust the settings" />);
  expect(screen.getByText("Adjust the settings")).toBeInTheDocument();
});

test("renders icon", async () => {
  render(<Accordion icon={EIcon.cog} />);
  expect(await screen.findByTestId("svg-cog")).toBeInTheDocument();
});

test("renders description as node", () => {
  render(<Accordion description={<div>Adjust the settings</div>} />);
  expect(screen.getByText("Adjust the settings")).toBeInTheDocument();
});

test("renders caret-down icon when title bar is closed", async () => {
  render(<Accordion />);
  expect(await screen.findByTestId("svg-caret-down")).toBeInTheDocument();
});

test("renders caret-up icon when title bar is closed", async () => {
  render(<Accordion open />);
  expect(await screen.findByTestId("svg-caret-up")).toBeInTheDocument();
});

test("doesn't render caret icons when `isAlwaysOpen` = `true`", async () => {
  render(<Accordion isAlwaysOpen />);
  expect(await screen.queryByTestId("svg-caret-down")).not.toBeInTheDocument();
  expect(await screen.queryByTestId("svg-caret-up")).not.toBeInTheDocument();
  // expect(screen.queryByText("caret-up-icon-mock")).not.toBeInTheDocument();
  // expect(screen.queryByText("caret-down-icon-mock")).not.toBeInTheDocument();
});
