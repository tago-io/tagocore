jest.mock("../src/Helpers/useApiRequest.ts");
jest.mock("../src/System/Socket.ts");

import type { FC, ReactElement } from "react";
import "@testing-library/jest-dom";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { lightTheme } from "../src/theme.ts";
import { icons } from "../src/Components/Icon/Icon.types";

const AllTheProviders: FC = ({ children }) => {
  return (
    <ThemeProvider theme={lightTheme as any}>
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Switch>
          <Route path="/">{children}</Route>
        </Switch>
      </MemoryRouter>
    </ThemeProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Manually iterates through all of the icons and mocks each one to return
 * another element in order to avoid `lazy` imports from react.
 */
const manuallyMockIcons = () => {
  for (const key in icons) {
    if (key in icons) {
      (icons as any)[key] = {
        ReactComponent: () => <svg>{key}-icon-mock</svg>,
      }
    }
  }
};

manuallyMockIcons();

export { fireEvent, act, waitFor, screen } from "@testing-library/react";
export { customRender as render };
