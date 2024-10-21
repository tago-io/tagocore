import { fireEvent, render, screen } from "../../../utils/test-utils.ts";
import { EIcon } from "../Icon/Icon.types";
import Accordion from "./Accordion.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Accordion />);
  expect(fn).not.toThrowError();
});

test("doesn't render children if `open` = `false`", () => {
  render(<Accordion>Hello world</Accordion>);
  expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
});

test("renders children if `open` = `true`", () => {
  render(<Accordion open>Hello world</Accordion>);
  expect(screen.queryByText("Hello world")).toBeInTheDocument();
});

test("calls onChangeOpen when clicking on the title bar", () => {
  const onChangeOpen = jest.fn();
  render(<Accordion onChangeOpen={onChangeOpen}>Hello world</Accordion>);
  expect(onChangeOpen).not.toHaveBeenCalled();
  fireEvent.click(screen.getByTestId("title-bar"));
  expect(onChangeOpen).toHaveBeenCalled();
});

test("doesn't call onChangeOpen if it's undefined", () => {
  render(<Accordion>Hello world</Accordion>);
  const fn = () => fireEvent.click(screen.getByTestId("title-bar"));
  expect(fn).not.toThrowError();
});

test("doesn't call onChangeOpen if `isAlwaysOpen` = `true`", () => {
  const onChangeOpen = jest.fn();
  render(
    <Accordion isAlwaysOpen onChangeOpen={onChangeOpen}>
      Hello world
    </Accordion>
  );
  expect(onChangeOpen).not.toHaveBeenCalled();
  fireEvent.click(screen.getByTestId("title-bar"));
  expect(onChangeOpen).not.toHaveBeenCalled();
});

test("doesn't call onChangeOpen if clicking on the children", () => {
  const onChangeOpen = jest.fn();
  render(
    <Accordion open onChangeOpen={onChangeOpen}>
      Hello world
    </Accordion>
  );
  expect(onChangeOpen).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText("Hello world"));
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

test("renders icon", () => {
  render(<Accordion icon={EIcon.cog} />);
  expect(screen.getByText("cog-icon-mock")).toBeInTheDocument();
});

test("renders description as node", () => {
  render(<Accordion description={<div>Adjust the settings</div>} />);
  expect(screen.getByText("Adjust the settings")).toBeInTheDocument();
});

test("renders caret-down icon when title bar is closed", () => {
  render(<Accordion />);
  expect(screen.getByText("caret-down-icon-mock")).toBeInTheDocument();
});

test("renders caret-up icon when title bar is closed", () => {
  render(<Accordion open />);
  expect(screen.getByText("caret-up-icon-mock")).toBeInTheDocument();
});

test("doesn't render caret icons when `isAlwaysOpen` = `true`", () => {
  render(<Accordion isAlwaysOpen />);
  expect(screen.queryByText("caret-up-icon-mock")).not.toBeInTheDocument();
  expect(screen.queryByText("caret-down-icon-mock")).not.toBeInTheDocument();
});
