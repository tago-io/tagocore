import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { EIcon, EmptyMessage, Loading, InnerNav } from "@tago-io/tcore-console";
import { useTheme } from "styled-components";
import Card from "./Card/Card";
import * as Style from "./PluginStore.style";

/**
 * Query to fetch the details of the plugin.
 */
const QUERY = gql`
  query ($name: String, $category: String) {
    pluginList(name: $name, category: $category) {
      name
      id
      version
      short_description
      logo_url
      publisher {
        name
        domain
      }
    }
  }
`;

/**
 * The plugin store page.
 */
function PluginStore() {
  const [filter] = useState("");
  const theme = useTheme() as any;

  const { data, error } = useQuery(QUERY, {
    variables: { name: filter },
    fetchPolicy: "network-only",
  });

  const plugins = data?.pluginList || [];
  const loading = !data;

  /**
   * Renders a single plugin card.
   */
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

  /**
   */
  useEffect(() => {
    window.top?.postMessage({ type: "set-link", url: `/pages/pluginstore` }, "*");
  }, []);

  return (
    <Style.Container>
      <InnerNav
        color={theme.extension}
        description="Search and install plugins from the Plugin store."
        icon={EIcon.store}
        title="Plugin Store"
      />

      <div className="content">
        {error ? (
          <EmptyMessage
            icon={EIcon.wifi}
            message={
              <Style.ConnectErrorMsg>
                <h1>Could not connect to the Plugin Store.</h1>
                <div>Make sure you have internet access and try again later.</div>
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
                <EmptyMessage icon={EIcon["puzzle-piece"]} message="No plugins found" />
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

export default PluginStore;
