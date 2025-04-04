import type { IPluginList } from "@tago-io/tcore-sdk/types";
import axios, { type Method } from "axios";
import { runInAction } from "mobx";
import type { PropsWithChildren } from "react";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet, redirect, useLoaderData } from "react-router";
import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import imgFavicon from "../assets/images/favicon.png";
import ActionEdit from "./Components/Action/Edit/ActionEdit.tsx";
import ActionList from "./Components/Action/List/ActionList.tsx";
import AnalysisEdit from "./Components/Analysis/Edit/AnalysisEdit.tsx";
import AnalysisList from "./Components/Analysis/List/AnalysisList.tsx";
import DeviceEdit from "./Components/Device/Edit/DeviceEdit.tsx";
import DeviceList from "./Components/Device/List/DeviceList.tsx";
import Home from "./Components/Home/Home.tsx";
import Login from "./Components/Login/Login.tsx";
import Logs from "./Components/Logs/Logs.tsx";
import MainScreen from "./Components/MainScreen/MainScreen.tsx";
import PageIFrame from "./Components/PageIframe/PageIFrame.tsx";
import PluginEdit from "./Components/Plugins/Edit/PluginEdit.tsx";
import Settings from "./Components/Settings/Edit/Settings.tsx";
import Setup, {
  getSetupSteps,
  hasFinishedSetup,
} from "./Components/Setup/Setup.tsx";
import StepDatabaseError from "./Components/Setup/StepDatabaseError/StepDatabaseError.tsx";
import PluginDetails from "./Components/Store/Details/PluginDetails.tsx";
import PluginsPage from "./Components/Store/List/PluginStore.tsx";
import GlobalStyles from "./Components/Styles/GlobalStyles.ts";
import { getLocalStorage, setLocalStorage } from "./Helpers/localStorage.ts";
import getAccountByToken from "./Requests/getAccountByToken.ts";
import { startSocket } from "./System/Socket.ts";
import store from "./System/Store.ts";
import { lightTheme } from "./theme.ts";

async function apiFetch<ResponseData = unknown>(
  url: string,
  options?: { method?: Method; data?: unknown },
) {
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = { token, masterPassword };
  const method = options?.method || "get";

  try {
    const { data: response } = await axios({
      method,
      url,
      data: options?.data,
      headers,
    });

    if (response?.result !== undefined) {
      return { data: response.result as ResponseData, error: null };
    }

    return { data: response as ResponseData, error: null };
  } catch (error) {
    return { error, data: null };
  }
}

export type TStatusResponse = {
  version: string;
  account: boolean;
  database?: {
    error?: string;
    configured?: boolean;
  };
  master_password: boolean;
};

function ConsoleWrapper() {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="shortcut icon" href={imgFavicon} />
        </Helmet>

        <ThemeProvider theme={lightTheme}>
          <GlobalStyles />

          <MainScreen>
            <Outlet />
          </MainScreen>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

function PageModuleRoutes() {
  const loaderData = useLoaderData() as {
    pageModules:
      | {
          pluginID: string;
          setup: {
            name: string;
            route: string;
          };
        }[]
      | null;
  };

  const { pageModules } = loaderData;

  return (
    <Routes>
      {pageModules?.map((module) => (
        <Route
          key={module.pluginID}
          path={`${module.setup.route}`}
          element={<PageIFrame title={module.setup.name} />}
        />
      ))}
    </Routes>
  );
}

function SimpleWrapper(props: PropsWithChildren) {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="shortcut icon" href={imgFavicon} />
        </Helmet>

        <ThemeProvider theme={lightTheme}>
          <GlobalStyles />

          {props.children}
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/console",
    loader: async () => {
      const { data: status } = await apiFetch<TStatusResponse>("/status");

      if (!status || status.database?.error) {
        return redirect("/console/database/error");
      }

      if (
        !status.account ||
        !status.database?.configured ||
        !status.master_password
      ) {
        return redirect("/console/setup");
      }

      const token = getLocalStorage("token");
      if (!token) {
        runInAction(() => {
          store.token = "";
        });

        return redirect("/console/login");
      }

      try {
        const account = await getAccountByToken(token);
        store.token = token;
        store.account = account;
      } catch {
        store.token = "";
        setLocalStorage("token", "");

        return redirect("/console/login");
      }

      const { data: plugins } = await apiFetch<IPluginList>("/plugin");

      runInAction(() => {
        store.version = status.version;
        store.databaseConfigured = status.database?.configured ?? false;
        store.databaseError = !!status.database?.error;
        store.masterPasswordConfigured = status.master_password;
        store.accountConfigured = status.account;

        if (plugins) {
          store.plugins = plugins;
        }
      });

      if (store.masterPassword || store.token) {
        startSocket();
      }

      return null;
    },

    element: <ConsoleWrapper />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "actions",
        element: <ActionList />,
      },
      {
        path: "actions/:id",
        element: <ActionEdit />,
      },
      {
        path: "analysis",
        element: <AnalysisList />,
      },
      {
        path: "analysis/:id",
        element: <AnalysisEdit />,
      },
      {
        path: "devices",
        element: <DeviceList />,
      },
      {
        path: "devices/:id",
        element: <DeviceEdit />,
      },
      {
        path: "logs",
        element: <Logs />,
      },
      {
        path: "plugin/:id",
        element: <PluginEdit />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "pluginstore",
        element: <PluginsPage />,
      },
      {
        path: "pluginstore/detail/:id",
        element: <PluginDetails />,
      },
      {
        path: "*",
        loader: async () => {
          const { data: pageModules = [] } =
            await apiFetch<any[]>("/module?type=page");

          return { pageModules };
        },
        element: <PageModuleRoutes />,
      },
    ],
  },

  {
    path: "/console/login",
    element: (
      <SimpleWrapper>
        <Login />
      </SimpleWrapper>
    ),
  },

  {
    path: "/console/setup",
    loader: async (a) => {
      const { data: status } = await apiFetch<TStatusResponse>("/status");

      if (!status) {
        throw new Error("Error getting status from TagoCore API");
      }

      const stepList = getSetupSteps(status);
      if (hasFinishedSetup(stepList)) {
        return redirect("/console");
      }

      return { stepList };
    },

    element: (
      <SimpleWrapper>
        <Setup />
      </SimpleWrapper>
    ),
  },

  {
    path: "/console/database/error",
    element: (
      <SimpleWrapper>
        <StepDatabaseError />
      </SimpleWrapper>
    ),
  },
]);

const rootNode = document.getElementById("root");
if (rootNode) {
  const root = createRoot(rootNode);

  root.render(<RouterProvider router={router} />);
} else {
  console.error("Could not find root node to render.");
}
