import { Loading } from "@tago-io/tcore-console";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Auth from "./Auth/Auth.tsx";
import Details from "./Details/Details.tsx";

/**
 * Main app of the front-end system. This component will figure out what
 * screen to show based on the authentication status of the user, and will also
 * identify which port to use from the configs.
 */
function App() {
  const [tcore, setTCore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [port, setPort] = useState(8999);

  /**
   * Fetches the tcore instance and sets it locally.
   */
  const fetchTCore = async () => {
    const location = window.location;
    axios
      .get(`${location.protocol}//${location.hostname}:${port}/tcore`)
      .then((r) => {
        setTCore(r.data.result);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  /**
   * Signs out.
   */
  const signOut = useCallback(async () => {
    const location = window.location;
    await axios.post(
      `${location.protocol}//${location.hostname}:${port}/sign-out`,
    );
    setTCore(null);
    setLoading(false);
  }, []);

  /**
   * Tries to fetch tcore once we load the app.
   */
  useEffect(() => {
    if (port) {
      fetchTCore();
    }
  }, [port]);

  /**
   * TODO:
   * Tries to fetch tcore once we load the app.
   */
  // useEffect(() => {
  //   const portConfig = data?.modules?.find((x) => x.id === "navbar-button")?.configs?.[0];
  //   if (portConfig?.type == "number") {
  //     setPort(Number(portConfig.defaultValue));
  //   }
  // }, [data]);

  if (loading || !port) {
    return <Loading />;
  }

  if (tcore) {
    return <Details onSignOut={signOut} port={port} tcore={tcore} />;
  }

  return <Auth onSignIn={fetchTCore} port={port} />;
}

export default App;
