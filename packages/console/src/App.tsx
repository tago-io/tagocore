import type { IPluginList } from "@tago-io/tcore-sdk/types";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useNavigate } from "react-router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import imgFavicon from "../assets/images/favicon.png";
import ActionEdit from "./Components/Action/Edit/ActionEdit.tsx";
import ActionList from "./Components/Action/List/ActionList.tsx";
import AnalysisEdit from "./Components/Analysis/Edit/AnalysisEdit.tsx";
import AnalysisList from "./Components/Analysis/List/AnalysisList.tsx";
import BucketEdit from "./Components/Bucket/Edit/BucketEdit.tsx";
import DeviceEdit from "./Components/Device/Edit/DeviceEdit.tsx";
import DeviceList from "./Components/Device/List/DeviceList.tsx";
import Home from "./Components/Home/Home.tsx";
import Login from "./Components/Login/Login.tsx";
import Logs from "./Components/Logs/Logs.tsx";
import MainScreen from "./Components/MainScreen/MainScreen.tsx";
import PageIFrame from "./Components/PageIframe/PageIFrame.tsx";
import PluginEdit from "./Components/Plugins/Edit/PluginEdit.tsx";
import Settings from "./Components/Settings/Edit/Settings.tsx";
import Setup from "./Components/Setup/Setup.tsx";
import StepDatabaseError from "./Components/Setup/StepDatabaseError/StepDatabaseError.tsx";
import PluginDetails from "./Components/Store/Details/PluginDetails.tsx";
import PluginStore from "./Components/Store/List/PluginStore.tsx";
import GlobalStyles from "./Components/Styles/GlobalStyles.ts";
import { getLocalStorage, setLocalStorage } from "./Helpers/localStorage.ts";
import useApiRequest from "./Helpers/useApiRequest.ts";
import getAccountByToken from "./Requests/getAccountByToken.ts";
import { startSocket } from "./System/Socket.ts";
import store from "./System/Store.ts";
import { lightTheme } from "./theme.ts";

/**
 * Main component of the application.
 */
function App() {
  const themeObject = lightTheme;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="shortcut icon" href={imgFavicon} />
        </Helmet>

        <ThemeProvider theme={themeObject as any}>
          <GlobalStyles />

          <BrowserRouter>
            <WrappedStoreRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

/**
 * Wrapper that does all the authentication logic.
 */
const WrappedStoreRoutes = observer(() => {
  const { data: status } = useApiRequest<any>("/status");
  const { data: plugins } = useApiRequest<IPluginList>("/plugin", {
    skip: !store.token,
  });
  const [readyToRender, setReadyToRender] = useState(false);
  const [token] = useState(() => getLocalStorage("token", ""));
  const navigate = useNavigate();

  const validateAuth = async () => {
    if (token) {
      // has token, but maybe it's expired
      store.token = token;
      getAccountByToken(token)
        .then((account) => {
          store.account = account;
          setReadyToRender(true);
        })
        .catch(() => {
          store.token = "";
          setLocalStorage("token", "");
          setReadyToRender(true);
          navigate("/console/login");
        });
    } else {
      // not logged in
      store.token = "";
      setReadyToRender(true);
      navigate("/console/login");
    }
  };

  useEffect(() => {
    if (plugins) {
      runInAction(() => {
        store.plugins = plugins;
      });
    }
  }, [plugins]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect state machine
  useEffect(() => {
    if (status) {
      if (status.database?.error) {
        // database has error
        setReadyToRender(true);
        navigate("/console/database/error");
      } else if (
        !status.account ||
        !status.database?.configured ||
        !status.master_password
      ) {
        // not configured, go to setup
        setReadyToRender(true);
        navigate("/console/setup");
      } else {
        // configured, validate token
        validateAuth();
      }

      runInAction(() => {
        store.version = status.version;
        store.databaseConfigured = status.database.configured;
        store.databaseError = status.database.error;
        store.masterPasswordConfigured = status.master_password;
        store.accountConfigured = status.account;
      });
    }
  }, [status, navigate]);

  /**
   * Starts the socket connection.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: mobx observers
  useEffect(() => {
    if (store.masterPassword || store.token) {
      startSocket();
    }
  }, [store.masterPassword, store.token]);

  if (!readyToRender) {
    return null;
  }

  return (
    <Routes>
      <Route path="/console/database/error" element={<StepDatabaseError />} />
      <Route path="/console/setup" element={<Setup />} />
      <Route path="/console/login" element={<Login />} />
      <Route path="/console/*" element={<MainScreenWrapper />} />
    </Routes>
  );
});

/**
 * Renders the main admin screen, which is the one that has the sidebar and navbar.
 */
function MainScreenWrapper() {
  const { data: pageModules } = useApiRequest<any[]>("/module?type=page");

  return (
    <MainScreen>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/actions" element={<ActionList />} />
        <Route path="/actions/:id" element={<ActionEdit />} />
        <Route path="/analysis" element={<AnalysisList />} />
        <Route path="/analysis/:id" element={<AnalysisEdit />} />
        <Route path="/buckets/:id" element={<BucketEdit />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/devices/:id" element={<DeviceEdit />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/plugin/:id" element={<PluginEdit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pluginstore" element={<PluginStore />} />
        <Route path="/pluginstore/detail/:id" element={<PluginDetails />} />

        {pageModules?.map((module) => (
          <Route
            key={module.pluginID}
            path={`/${module.setup.route}`}
            element={<PageIFrame title={module.name} />}
          />
        ))}
      </Routes>
    </MainScreen>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
