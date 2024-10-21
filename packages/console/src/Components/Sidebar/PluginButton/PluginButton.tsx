import { useCallback, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { useLocation } from "react-router";
import type { IPluginListItem } from "@tago-io/tcore-sdk/types";
import disablePlugin from "../../../Requests/disablePlugin.ts";
import enablePlugin from "../../../Requests/enablePlugin.ts";
import Icon from "../../Icon/Icon.tsx";
import { EIcon } from "../../Icon/Icon.types";
import PluginImage from "../../PluginImage/PluginImage.tsx";
import { ModalUninstallPlugin } from "../../../index.ts";
import uninstallPlugin from "../../../Requests/uninstallPlugin.ts";
import * as Style from "./PluginButton.style";

/**
 * Props.
 */
interface IPluginButtonProps {
  item: IPluginListItem;
}

/**
 */
function PluginButton(props: IPluginButtonProps) {
  const { item } = props;
  const { error, id, name, version, state } = item;
  const [dropdown, setDropdown] = useState(false);
  const [modalUninstall, setModalUninstall] = useState(false);
  const theme = useTheme();
  const loc = useLocation();

  const currentPath = loc.pathname;
  const selected = currentPath.includes(id);

  /**
   */
  const onClickOptions = useCallback((e) => {
    e.preventDefault();
    setDropdown(true);
  }, []);

  /**
   */
  const enable = useCallback(
    (e) => {
      setDropdown(false);
      e.preventDefault();
      enablePlugin(id);
    },
    [id]
  );

  /**
   */
  const disable = useCallback(
    (e) => {
      setDropdown(false);
      e.preventDefault();
      disablePlugin(id);
    },
    [id]
  );

  /**
   */
  useEffect(() => {
    function closeDropdown() {
      setDropdown(false);
    }

    window.addEventListener("mousedown", closeDropdown);
    return () => window.removeEventListener("mousedown", closeDropdown);
  });

  const disabled = state === "disabled";

  return (
    <Style.Container
      color={theme.extension}
      disabled={disabled}
      selected={selected}
      $dropdownVisible={dropdown}
      to={`/console/plugin/${id}`}
    >
      <div className="img-container">
        <PluginImage src={`/images/${id}/icon`} width={40} />
      </div>

      <Style.TitleContainer disabled={disabled}>
        <div className="title">
          <div className="title-row">
            <span>{name}</span>
            {error && !disabled && (
              <div className="error">
                <Icon icon={EIcon["exclamation-triangle"]} size="9px" color={theme.buttonDanger} />
              </div>
            )}
          </div>

          <span className="version">
            {version} {disabled ? " • " : ""}
            {disabled && <span className="disabled">Disabled</span>}
          </span>
        </div>
      </Style.TitleContainer>

      {(item.allow_disable || item.allow_uninstall) && (
        <Style.Options onClick={onClickOptions}>
          <Icon icon={EIcon["ellipsis-v"]} />
        </Style.Options>
      )}

      <Style.Dropdown visible={dropdown} onMouseDown={(e) => e.stopPropagation()}>
        {item.allow_disable &&
          (disabled ? (
            <div className="item" onClick={enable}>
              <Icon icon={EIcon.check} />
              <span>Enable Plugin</span>
            </div>
          ) : (
            <div className="item" onClick={disable}>
              <Icon icon={EIcon.ban} />
              <span>Disable Plugin</span>
            </div>
          ))}
      </Style.Dropdown>

      {modalUninstall && (
        <ModalUninstallPlugin
          onClose={() => setModalUninstall(false)}
          onConfirm={(keepData) => uninstallPlugin(id, keepData)}
          redirectTo="/"
        />
      )}
    </Style.Container>
  );
}

export default PluginButton;
