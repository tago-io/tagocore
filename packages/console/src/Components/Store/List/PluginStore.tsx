import { useEffect } from "react";
import { useTheme } from "styled-components";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import EmptyMessage from "../../EmptyMessage/EmptyMessage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import InnerNav from "../../InnerNav/InnerNav.tsx";
import Loading from "../../Loading/Loading.tsx";
import Card from "./Card/Card.tsx";
import * as Style from "./PluginStore.style";

function PluginsPage() {
  const theme = useTheme() as any;
  const { data, error } = useApiRequest<Array<any>>("/plugins/store");
  const plugins = data || [];
  const loading = !data;

  const renderPlugin = (plugin: any) => {
    return (
      <Card
        description={plugin.short_description}
        id={plugin.id}
        key={plugin.id}
        logoURL={plugin.logo_url}
        name={plugin.name}
        publisherDomain={plugin.publisher?.domain}
        publisherName={plugin.publisher?.name}
        version={plugin.version}
      />
    );
  };

  useEffect(() => {
    window.top?.postMessage(
      { type: "set-link", url: "/pages/pluginstore" },
      "*",
    );
  }, []);

  return (
    <Style.Container>
      <InnerNav
        color={theme.extension}
        description="Browse available plugins to extend TagoCore's functionality."
        icon={EIcon["puzzle-piece"]}
        title="Plugins"
      />

      <div className="content">
        {error ? (
          <EmptyMessage
            icon={EIcon.wifi}
            message={
              <Style.ConnectErrorMsg>
                <h1>Could not connect to the Plugin Store.</h1>
                <div>
                  Make sure you have internet access and try again later.
                </div>
              </Style.ConnectErrorMsg>
            }
          />
        ) : loading ? (
          <Loading />
        ) : (
          <>
            <Style.Grid>
              {loading ? (
                <Loading />
              ) : plugins.length === 0 ? (
                <EmptyMessage
                  icon={EIcon["puzzle-piece"]}
                  message="No plugins found"
                />
              ) : (
                plugins.map(renderPlugin)
              )}
            </Style.Grid>
          </>
        )}
      </div>
    </Style.Container>
  );
}

export default PluginsPage;
