jest.setMock("./RequestChart/RequestChart.tsx", "div");

import { getSystemName } from "@tago-io/tcore-shared";
import { render, screen } from "../../../utils/test-utils.ts";
import Home from "./Home.tsx";

test("renders without crashing", () => {
  const fn = () => render(<Home />);
  expect(fn).not.toThrowError();
});

test("sets document.title", () => {
  render(<Home />);
  expect(document.title).toEqual(`Home | ${getSystemName()}`);
});

test("renders `Summary` card", () => {
  render(<Home />);
  expect(screen.getByText("Summary")).toBeInTheDocument();
  expect(screen.getByTestId("home-summary")).toBeInTheDocument();
});

test("renders `Computer Usage` card", () => {
  render(<Home />);
  expect(screen.getByText("Computer Usage")).toBeInTheDocument();
  expect(screen.getByTestId("home-computer-usage")).toBeInTheDocument();
});

test("renders `Operating System` card", () => {
  render(<Home />);
  expect(screen.getByText("Operating System")).toBeInTheDocument();
  expect(screen.getByTestId("home-os")).toBeInTheDocument();
});
