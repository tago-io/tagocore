import { useEffect, useState } from "react";
import { useRouteMatch } from "react-router";
import { observer } from "mobx-react";
import useApiRequest from "../../../Helpers/useApiRequest";
import Loading from "../../Loading/Loading";
import EmptyMessage from "../../EmptyMessage/EmptyMessage";
import { EIcon } from "../../Icon/Icon.types";
import Banner from "./Banner/Banner";
import * as Style from "./PluginDetails.style";
import DataTabs from "./DataTabs/DataTabs";
import Sidebar from "./Sidebar/Sidebar";

/**
 * The plugin details page.
 */
function PluginDetails() {
  const match = useRouteMatch<{ id: string }>();
  const { id } = match.params;

  const [selectedVersion, setSelectedVersion] = useState(() => "");

  const { data: platform } = useApiRequest<string>("/hardware/platform");
  const { data, error } = useApiRequest<any>(`/plugins/store/${id}`);

  const plugin = data;
  const installURL = "";

  const loading = !plugin;

  /**
   * Updates the URL with the new selected version.
   */
  useEffect(() => {
    if (selectedVersion) {
      history.replaceState(
        null,
        "",
        `/console/pluginstore/details/${id}?version=${selectedVersion}`
      );
    }
  }, [id, selectedVersion]);

  /**
   */
  useEffect(() => {
    window.top?.postMessage({ type: "set-link", url: `/console/pluginstore/detail/${id}` }, "*");
  }, [id]);

  if (error) {
    return (
      <EmptyMessage
        icon={EIcon.wifi}
        message={
          <Style.ConnectErrorMsg>
            <h1>Could not connect to the Plugin Store.</h1>
            <div>Make sure you have internet access and try again later.</div>
          </Style.ConnectErrorMsg>
        }
      />
    );
  }

  if (loading) {
    // if the screen is loading we show a loading status
    return <Loading />;
  }

  return (
    <Style.Container>
      <Banner
        plugin={plugin}
        installURL={installURL}
        onChangeSelectedVersion={setSelectedVersion}
        selectedVersion={selectedVersion || plugin.versions}
        systemPlatform={platform}
      />

      <div className="content">
        <div className="data-tabs-container">
          <DataTabs
            markdownURL={plugin.full_description_url}
            screenshots={plugin.screenshots}
            themeColor={plugin.theme_color}
            pluginVersion={selectedVersion || plugin.version}
            pluginID={id}
          />
        </div>

        <Sidebar
          categories={plugin.categories || []}
          classTypes={plugin.class_types || []}
          permissions={plugin.permissions || []}
          platforms={plugin.platforms || []}
          publishDate={plugin.created_at}
          publisherName={plugin.publisher?.name}
          publisherDomain={plugin.publisher.domain}
          version={plugin.version}
        />
      </div>
    </Style.Container>
  );
}

export default observer(PluginDetails);
