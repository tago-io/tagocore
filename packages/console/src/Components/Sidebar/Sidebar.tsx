import type {
  IPluginButtonModuleSetupOption,
  IPluginListItem,
} from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useTheme } from "styled-components";
import { getSocket } from "../../System/Socket.ts";
import store from "../../System/Store.ts";
import { EIcon } from "../Icon/Icon.types";
import InstallLocalPluginButton from "./InstalLocalPluginButton/InstalLocalPluginButton.tsx";
import Item from "./Item.tsx";
import PluginButton from "./PluginButton/PluginButton.tsx";
import * as Style from "./Sidebar.style";
import { useEnabledPlugins } from "../../Requests/getPluginList.ts";

interface SidebarProps {
  open: boolean;
}

function Sidebar(props: SidebarProps) {
  const theme = useTheme();

  const { data: plugins } = useEnabledPlugins();

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
      text: "Plugins",
      icon: EIcon["puzzle-piece"],
      color: theme.settings,
      action: {
        type: "open-url",
        url: "/console/pluginstore",
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
      text: "Logs",
      icon: EIcon.scroll,
      color: theme.settings,
      action: {
        type: "open-url",
        url: "/logs",
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

  for (const plugin of plugins || []) {
    for (const button of plugin.buttons.sidebar || []) {
      const item = buttons[button.position];
      if (item === null) {
        buttons.splice(button.position, 1, button);
      } else {
        buttons.splice(button.position, 0, button);
      }
    }
  }

  const renderPlugin = (item: IPluginListItem) => {
    if (item.hidden) {
      return null;
    }
    return <PluginButton key={item.id} item={item} />;
  };

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: mobx observer
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
  }, [store.socketConnected, store.plugins]);

  return (
    <Style.Container data-testid="sidebar" open={props.open}>
      {plugins && (
        <>
          <div className="stretch">
            <div className="buttons">{buttons.map(renderButton)}</div>
            <div style={{ marginTop: "6px" }}>{plugins.map(renderPlugin)}</div>
          </div>

          <InstallLocalPluginButton />
        </>
      )}
    </Style.Container>
  );
}

export default observer(Sidebar);
