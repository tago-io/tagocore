import type { IPlugin } from "@tago-io/tcore-sdk/types";
import { useCallback, useState } from "react";
import { Link } from "../../../../index.ts";
import Button from "../../../Button/Button.tsx";
import { EButton } from "../../../Button/Button.types";
import Icon from "../../../Icon/Icon.tsx";
// import Tooltip from "../../../Tooltip/Tooltip";
import { EIcon } from "../../../Icon/Icon.types";
import ModalUninstallPlugin from "../../Common/ModalUninstallPlugin/ModalUninstallPlugin.tsx";
import * as Style from "./Buttons.style";

interface IButtonsProps {
  data: IPlugin;
  onUninstall?: (keepData: boolean) => Promise<void>;
  onEnable: () => Promise<void>;
  onDisable: () => Promise<void>;
}

function Buttons(props: IButtonsProps) {
  const [modalUninstall, setModalUninstall] = useState(false);
  const { onEnable, data, onDisable } = props;

  const activateModalUninstall = useCallback(() => {
    setModalUninstall(true);
  }, []);

  const enable = useCallback(() => {
    onEnable();
  }, [onEnable]);

  const disable = useCallback(() => {
    onDisable();
  }, [onDisable]);

  return (
    <Style.Container>
      <Link href={`/console/logs?channel=plugin:${data.id}&type=all`}>
        <Button addIconMargin onClick={activateModalUninstall}>
          <Icon icon={EIcon.scroll} />
          <span>View logs</span>
        </Button>
      </Link>

      {data.allow_disable &&
        (props.data.state === "disabled" ? (
          <Button onClick={enable} addIconMargin>
            <Icon icon={EIcon.check} />
            <span>Enable</span>
          </Button>
        ) : props.data.state === "stopping" ||
          props.data.state === "starting" ? (
          <Button disabled addIconMargin>
            <span>Loading...</span>
          </Button>
        ) : (
          <Button onClick={disable} addIconMargin>
            <Icon icon={EIcon.ban} />
            <span>Disable</span>
          </Button>
        ))}
    </Style.Container>
  );
}

export default Buttons;
