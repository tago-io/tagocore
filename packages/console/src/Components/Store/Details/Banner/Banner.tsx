import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import useApiRequest from "../../../../Helpers/useApiRequest.ts";
import Publisher from "../../../Plugins/Common/Publisher/Publisher.tsx";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Icon from "../../../Icon/Icon.tsx";
import { EIcon } from "../../../Icon/Icon.types";
import Tooltip from "../../../Tooltip/Tooltip.tsx";
import PluginImage from "../../../PluginImage/PluginImage.tsx";
import { getLocalStorage } from "../../../../Helpers/localStorage.ts";
import store from "../../../../System/Store.ts";
import * as Style from "./Banner.style";

/**
 * Props.
 */
interface IBannerProps {
  installURL: string;
  onChangeSelectedVersion(version: string): void;
  plugin: any;
  selectedVersion: string;
  systemPlatform?: string;
}

/**
 * The banner at the top of the plugin details page.
 */
function Banner(props: IBannerProps) {
  const { data: status } = useApiRequest<any>("/status");
  const { data: installedPlugins } =
    useApiRequest<Array<string>>("/plugins/installed");
  const { plugin } = props;
  const { id, logo_url, name, publisher, short_description, compatibility, types } =
    plugin;

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

  /**
   * Called when the activate button is pressed.
   */
  const activate = useCallback(() => {
    axios.post(`/plugins/activate/${id}`, {}, { headers }).then(() => {
      setIsInstalled(true);
    });
  }, [id, headers]);

  /**
   * Edits the configuration of the plugin.
   */
  const editConfiguration = useCallback(() => {
    navigate(`/console/plugin/${id}`);
  }, [id, navigate]);

  /**
   * Called when the deactivate button is pressed.
   */
  const deactivate = useCallback(() => {
    axios.post(`/plugins/deactivate/${id}`, {}, { headers }).then(() => {
      setIsInstalled(false);
    });
  }, [id, headers]);

  /**
   * Renders the information part of the banner.
   */
  const renderInfo = () => {
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

  /**
   * Renders the install section.
   */
  const renderInstall = () => {
    const disabled = isIncompatible || isInstalled;
    const defaultPlugin = types?.includes("default");

    if (isInstalled) {
      return (
        <Style.Install>
          <Button onClick={editConfiguration} type={EButton.primary}>
            Edit configuration
          </Button>

          <Button
            style={{ padding: "8px 20px", marginTop: "10px" }}
            addIconMargin
            onClick={deactivate}
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
          <Button type={EButton.primary}>
            Default Plugin
          </Button>
        </Style.Install>
      </Tooltip>
      );
    }

    return (
      <Tooltip text={isInstalled ? "This version is already installed" : ""}>
        <Style.Install disabled={disabled}>
          <Button onClick={activate} type={EButton.primary}>
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

      {renderInfo()}
      {renderInstall()}
    </Style.Container>
  );
}

export default Banner;
