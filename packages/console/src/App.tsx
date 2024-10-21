import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { runInAction } from "mobx";
import { useEffect, useState } from "react";
import type { IPluginList } from "@tago-io/tcore-sdk/types";
import { useHistory } from "react-router";
import { observer } from "mobx-react";
import imgFavicon from "../assets/images/favicon.png";
import { lightTheme } from "./theme.ts";
import MainScreen from "./Components/MainScreen/MainScreen.tsx";
import GlobalStyles from "./Components/Styles/GlobalStyles.ts";
import DeviceList from "./Components/Device/List/DeviceList.tsx";
import BucketList from "./Components/Bucket/List/BucketList.tsx";
import ActionList from "./Components/Action/List/ActionList.tsx";
import AnalysisList from "./Components/Analysis/List/AnalysisList.tsx";
import Settings from "./Components/Settings/Edit/Settings.tsx";
import Home from "./Components/Home/Home.tsx";
import Logs from "./Components/Logs/Logs.tsx";
import DeviceEdit from "./Components/Device/Edit/DeviceEdit.tsx";
import BucketEdit from "./Components/Bucket/Edit/BucketEdit.tsx";
import ActionEdit from "./Components/Action/Edit/ActionEdit.tsx";
import AnalysisEdit from "./Components/Analysis/Edit/AnalysisEdit.tsx";
import PluginEdit from "./Components/Plugins/Edit/PluginEdit.tsx";
import useApiRequest from "./Helpers/useApiRequest.ts";
import store from "./System/Store.ts";
import PageIFrame from "./Components/PageIframe/PageIFrame.tsx";
import Login from "./Components/Login/Login.tsx";
import { getLocalStorage, setLocalStorage } from "./Helpers/localStorage.ts";
import getAccountByToken from "./Requests/getAccountByToken.ts";
import Setup from "./Components/Setup/Setup.tsx";
import StepDatabaseError from "./Components/Setup/StepDatabaseError/StepDatabaseError.tsx";
import { startSocket } from "./System/Socket.ts";
import PluginStore from "./Components/Store/List/PluginStore.tsx";
import PluginDetails from "./Components/Store/Details/PluginDetails.tsx";

/**
 * Main component of the application.
 */
function App() {
  const themeObject = lightTheme;

  return (
    <>
      <Helmet>
        <link rel="shortcut icon" href={imgFavicon} />
      </Helmet>

      <ThemeProvider theme={themeObject as any}>
        <GlobalStyles />

        <BrowserRouter>
          <StoreWrapper />
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

/**
 * Wrapper that does all the authentication logic.
 */
const StoreWrapper = observer(() => {
  const { data: status } = useApiRequest<any>("/status");
  const { data: plugins } = useApiRequest<IPluginList>("/plugin", { skip: !store.token });
  const [readyToRender, setReadyToRender] = useState(false);
  const [token] = useState(() => getLocalStorage("token", ""));
  const history = useHistory();

  /**
   */
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
          history.push("/console/login");
        });
    } else {
      // not logged in
      store.token = "";
      setReadyToRender(true);
      history.push("/console/login");
    }
  };

  /**
   */
  useEffect(() => {
    if (plugins) {
      runInAction(() => {
        store.plugins = plugins;
      });
    }
  }, [plugins]);

  /**
   */
  useEffect(() => {
    if (status) {
      if (status.database?.error) {
        // database has error
        setReadyToRender(true);
        history.push("/console/database/error");
      } else if (!status.account || !status.database?.configured || !status.master_password) {
        // not configured, go to setup
        setReadyToRender(true);
        history.push("/console/setup");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  /**
   * Starts the socket connection.
   */
  useEffect(() => {
    if (store.masterPassword || store.token) {
      startSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.masterPassword, store.token]);

  if (!readyToRender) {
    return null;
  }

  return (
    <Switch>
      <Route exact path="/console/database/error" component={StepDatabaseError} />
      <Route exact path="/console/setup" component={Setup} />
      <Route exact path="/console/login" component={Login} />
      <Route path="/console" component={MainScreenWrapper} />
      <Route component={() => null} />
    </Switch>
  );
});

/**
 * Renders the main admin screen, which is the one that has the sidebar and navbar.
 */
function MainScreenWrapper() {
  const { data: pageModules } = useApiRequest<any[]>("/module?type=page");

  return (
    <MainScreen>
      <Switch>
        <Route exact path="/console/actions" component={ActionList} />
        <Route exact path="/console/actions/:id" component={ActionEdit} />
        <Route exact path="/console/analysis" component={AnalysisList} />
        <Route exact path="/console/analysis/:id" component={AnalysisEdit} />
        <Route exact path="/console/buckets" component={BucketList} />
        <Route exact path="/console/buckets/:id" component={BucketEdit} />
        <Route exact path="/console/devices" component={DeviceList} />
        <Route exact path="/console/devices/:id" component={DeviceEdit} />
        <Route exact path="/console/logs" component={Logs} />
        <Route exact path="/console/plugin/:id" component={PluginEdit} />
        <Route exact path="/console/settings" component={Settings} />
        <Route exact path="/console/pluginstore" component={PluginStore} />
        <Route exact path="/console/pluginstore/detail/:id" component={PluginDetails} />

        {pageModules?.map((module) => (
          <Route
            exact
            key={module.pluginID}
            path={`/console${module.setup.route}`}
            component={() => <PageIFrame title={module.name} />}
          />
        ))}

        <Route component={Home} />
      </Switch>
    </MainScreen>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
