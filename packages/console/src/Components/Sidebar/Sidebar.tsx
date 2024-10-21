import { useTheme } from "styled-components";
import type { IPluginListItem, IPluginButtonModuleSetupOption } from "@tago-io/tcore-sdk/types";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { EIcon } from "../Icon/Icon.types";
import store from "../../System/Store.ts";
import { getSocket } from "../../System/Socket.ts";
import * as Style from "./Sidebar.style";
import Item from "./Item.tsx";
import InstallLocalPluginButton from "./InstalLocalPluginButton/InstalLocalPluginButton.tsx";
import PluginButton from "./PluginButton/PluginButton.tsx";

/**
 * Props.
 */
interface ISidebarProps {
  /**
   * Indicates if the sidebar is open or closed.
   */
  open: boolean;
}

/**
 * This component shows a sidebar on the left side of the page.
 */
function Sidebar(props: ISidebarProps) {
  const theme = useTheme();

  const buttons: Array<IPluginButtonModuleSetupOption | null> = [
    {
      color: theme.home,
      icon: EIcon.home,
      text: "Home",
      action: {
        type: "open-url",
        url: "/console/",
      },
    },
    null,
    {
      color: theme.device,
      icon: EIcon.device,
      text: "Devices",
      action: {
        type: "open-url",
        url: "/console/devices/",
      },
    },
    {
      color: theme.bucket,
      icon: EIcon.bucket,
      text: "Buckets",
      action: {
        type: "open-url",
        url: "/console/buckets/",
      },
    },
    {
      text: "Analysis",
      icon: EIcon.code,
      color: theme.analysis,
      action: {
        type: "open-url",
        url: "/console/analysis/",
      },
    },
    {
      text: "Actions",
      icon: EIcon.bolt,
      color: theme.action,
      action: {
        type: "open-url",
        url: "/console/actions/",
      },
    },
    {
      text: "Store",
      icon: EIcon.store,
      color: theme.settings,
      action: {
        type: "open-url",
        url: "/console/pluginstore",
      },
    },
    {
      text: "Settings",
      icon: EIcon.cog,
      color: theme.settings,
      action: {
        type: "open-url",
        url: "/console/settings/",
      },
    },
  ];

  for (const plugin of store.plugins) {
    for (const button of plugin.buttons.sidebar || []) {
      const item = buttons[button.position];
      if (item === null) {
        buttons.splice(button.position, 1, button);
      } else {
        buttons.splice(button.position, 0, button);
      }
    }
  }

  /**
   * Renders a single plugin.
   */
  const renderPlugin = (item: IPluginListItem) => {
    if (item.hidden) {
      return null;
    }
    return <PluginButton key={item.id} item={item} />;
  };

  /**
   */
  const renderButton = (item: any, index: number) => {
    if (!item) {
      return <div key={index} className="new-line" />;
    }

    return (
      <Item
        action={item.action}
        color={item.color}
        icon={item.icon}
        key={item.text}
        testId={item.text + index}
        text={item.text}
      />
    );
  };

  /**
   */
  useEffect(() => {
    function onStatus(params: any) {
      if (params.deleted) {
        store.plugins = store.plugins.filter((x) => x.id !== params.id);
        return;
      }

      const plugin = store.plugins.find((x) => x.id === params.id);
      if (plugin) {
        plugin.state = params.state;
        plugin.error = params.error;
        store.plugins = [...store.plugins];
      }
    }

    getSocket().on("plugin::sidebar", onStatus);
    return () => {
      getSocket().off("plugin::sidebar", onStatus);
    };
  });

  /**
   * Attaches the events to listen to the plugins.
   */
  useEffect(() => {
    if (store.socketConnected) {
      for (const plugin of store.plugins) {
        getSocket().emit("attach", "plugin", plugin.id);
      }
      return () => {
        for (const plugin of store.plugins) {
          getSocket().emit("unattach", "plugin", plugin.id);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.socketConnected, store.plugins.length]);

  return (
    <Style.Container data-testid="sidebar" open={props.open}>
      {store.plugins && (
        <>
          <div className="stretch">
            <div className="buttons">{buttons.map(renderButton)}</div>
            <div style={{ marginTop: "6px" }}>{store.plugins?.map(renderPlugin)}</div>
          </div>

          <InstallLocalPluginButton />
        </>
      )}
    </Style.Container>
  );
}

export default observer(Sidebar);
