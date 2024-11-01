import type { IPluginButtonModuleSetupAction } from "@tago-io/tcore-sdk/types";
import { useLocation } from "react-router";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import * as Style from "./Sidebar.style";

/**
 * Props.
 */
interface IItemProps {
  color: string;
  text: string;
  icon?: EIcon;
  testId?: string;
  error?: boolean;
  action: IPluginButtonModuleSetupAction;
}

/**
 * A single sidebar item (button).
 */
function Item(props: IItemProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { testId, error, color, icon, text, action } = props;

  const content = (
    <>
      <Icon size="18px" icon={icon} />

      <span style={{ display: "flex", opacity: error ? 0.65 : 1 }}>{text}</span>

      {error && (
        <div
          style={{
            position: "relative",
            top: "1px",
            marginLeft: "5px",
          }}
        >
          <Icon icon={EIcon["exclamation-triangle"]} size="10px" color="red" />
        </div>
      )}
    </>
  );

  if (action?.type === "open-url") {
    let buttonURL = String(action.url).replace(/\/\//g, "/");
    if (!buttonURL.startsWith("/")) {
      buttonURL = `/${buttonURL}`;
    }
    if (!buttonURL.startsWith("/console/")) {
      buttonURL = `/console${buttonURL}`;
    }

    const selected =
      buttonURL === "/console/"
        ? currentPath === buttonURL
        : currentPath.startsWith(buttonURL);

    return (
      <Style.ItemLink
        to={buttonURL}
        color={color}
        selected={selected}
        data-testid={testId}
      >
        {content}
      </Style.ItemLink>
    );
  }

  return (
    <Style.ItemDiv color={color} data-testid={testId}>
      {content}
    </Style.ItemDiv>
  );
}

export default Item;
