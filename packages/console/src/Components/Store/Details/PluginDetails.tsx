import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router";
import { observer } from "mobx-react";
import useApiRequest from "../../../Helpers/useApiRequest.ts";
import Loading from "../../Loading/Loading.tsx";
import EmptyMessage from "../../EmptyMessage/EmptyMessage.tsx";
import { EIcon } from "../../Icon/Icon.types";
import Banner from "./Banner/Banner.tsx";
import * as Style from "./PluginDetails.style";
import DataTabs from "./DataTabs/DataTabs.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";

/**
 * The plugin details page.
 */
function PluginDetails() {
  const match = useMatch("/console/pluginstore/detail/:id");
  const id = match?.params?.id;
  const navigate = useNavigate();

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
    navigate(`/console/pluginstore/detail/${id}`, { replace: true });
  }, [id]);

  /**
   */
  useEffect(() => {
    window.top?.postMessage(
      { type: "set-link", url: `/console/pluginstore/detail/${id}` },
      "*",
    );
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
