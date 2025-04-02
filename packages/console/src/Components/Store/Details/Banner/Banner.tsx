import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getLocalStorage } from "../../../../Helpers/localStorage.ts";
import useApiRequest from "../../../../Helpers/useApiRequest.ts";
import {
  useEnabledPlugins,
  useInstalledPluginIDs,
} from "../../../../Requests/getPluginList.ts";
import store from "../../../../System/Store.ts";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import PluginImage from "../../../PluginImage/PluginImage.tsx";
import Publisher from "../../../Plugins/Common/Publisher/Publisher.tsx";
import Tooltip from "../../../Tooltip/Tooltip.tsx";

import * as Style from "./Banner.style";

interface IBannerProps {
  installURL: string;
  plugin: any;
  selectedVersion: string;
  systemPlatform?: string;
  onChangeSelectedVersion(version: string): void;
}

function PluginBanner(props: IBannerProps) {
  const { data: status } = useApiRequest<any>("/status");

  const { data: installedPlugins, mutate: mutateInstalledPlugins } =
    useInstalledPluginIDs();
  const { mutate: mutateEnabledPlugins } = useEnabledPlugins();

  const { plugin } = props;
  const {
    id,
    logo_url,
    name,
    publisher,
    short_description,
    compatibility,
    types,
  } = plugin;

  const [isInstalled, setIsInstalled] = useState(
    installedPlugins?.includes(id),
  );
  useEffect(() => {
    setIsInstalled(installedPlugins?.includes(id));
  }, [installedPlugins, id]);
  const navigate = useNavigate();

  const runningInCluster = status?.cluster;
  const isClusterCompatible = !runningInCluster || compatibility?.cluster;

  const isIncompatible = !isClusterCompatible;
  const token = getLocalStorage("token", "") as string;
  const masterPassword = store.masterPassword;
  const headers = useMemo(
    () => ({ token, masterPassword }),
    [token, masterPassword],
  );

  const activatePlugin = useCallback(async () => {
    await axios.post(`/plugins/activate/${id}`, {}, { headers });
    setIsInstalled(true);

    mutateInstalledPlugins();
    mutateEnabledPlugins();
  }, [id, headers, mutateInstalledPlugins, mutateEnabledPlugins]);

  const editPluginSettings = useCallback(() => {
    navigate(`/console/plugin/${id}`);
  }, [id, navigate]);

  const deactivatePlugin = useCallback(async () => {
    await axios.post(`/plugins/deactivate/${id}`, {}, { headers });

    setIsInstalled(false);

    mutateInstalledPlugins();
    mutateEnabledPlugins();
  }, [id, headers, mutateInstalledPlugins, mutateEnabledPlugins]);

  const renderPluginInfoSection = () => {
    return (
      <Style.Info>
        <div className="title">
          <h1>{name}</h1>
        </div>

        {publisher?.name && (
          <div className="publisher">
            <Publisher
              clickable
              domain={publisher?.domain}
              name={publisher?.name}
              size="medium"
            />
          </div>
        )}

        {short_description && (
          <div className="description">{short_description}</div>
        )}
      </Style.Info>
    );
  };

  const renderPluginInstallSection = () => {
    const disabled = isIncompatible || isInstalled;
    const defaultPlugin = types?.includes("default");

    if (isInstalled) {
      return (
        <Style.Install>
          <Button onClick={editPluginSettings} type={EButton.primary}>
            Configure plugin
          </Button>

          <Button
            style={{ padding: "8px 20px", marginTop: "10px" }}
            addIconMargin
            onClick={deactivatePlugin}
            type={EButton.danger_outline}
          >
            <Icon icon={EIcon["trash-alt"]} />
            <span>Deactivate</span>
          </Button>
        </Style.Install>
      );
    }

    if (defaultPlugin) {
      return (
        <Tooltip text={""}>
          <Style.Install disabled={true}>
            <Button type={EButton.primary}>Default Plugin</Button>
          </Style.Install>
        </Tooltip>
      );
    }

    return (
      <Tooltip text={isInstalled ? "This version is already installed" : ""}>
        <Style.Install disabled={disabled}>
          <Button onClick={activatePlugin} type={EButton.primary}>
            Activate
          </Button>

          {!isClusterCompatible ? (
            <div className="error">
              <Icon icon={EIcon["exclamation-triangle"]} size="10px" />
              <span> This version can&apos;t run in a Cluster instance</span>
            </div>
          ) : null}
        </Style.Install>
      </Tooltip>
    );
  };

  return (
    <Style.Container>
      <PluginImage width={150} src={logo_url} />

      {renderPluginInfoSection()}
      {renderPluginInstallSection()}
    </Style.Container>
  );
}

export default PluginBanner;
