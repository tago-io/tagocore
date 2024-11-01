vi.mock("../src/Helpers/useApiRequest.ts");
vi.mock("../src/System/Socket.ts");

import type { PropsWithChildren, ReactElement } from "react";
import "@testing-library/jest-dom";
import { type RenderOptions, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "../src/theme.ts";

function AllTheProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={lightTheme as any}>
      <MemoryRouter initialEntries={["/"]} initialIndex={0}>
        <Routes>
          <Route path="/" element={children} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>
  );
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

function renderWithEvents(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  };
}

export { act, waitFor, screen } from "@testing-library/react";
export { customRender as render, renderWithEvents };
