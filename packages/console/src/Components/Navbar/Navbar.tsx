import type {
  IPluginButtonModuleSetupOption,
  IPluginListItem,
} from "@tago-io/tcore-sdk/types";
import { observer } from "mobx-react";
import { readableColor } from "polished";
import { Fragment, useCallback } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "styled-components";
import LogoBlack from "../../../assets/images/logo-black.svg";
import LogoWhite from "../../../assets/images/logo-white.svg";
import { setLocalStorage } from "../../Helpers/localStorage.ts";
import store from "../../System/Store.ts";
import Button from "../Button/Button.tsx";
import { EButton } from "../Button/Button.types";
import Icon from "../Icon/Icon.tsx";
import { EIcon } from "../Icon/Icon.types";
import Link from "../Link/Link.tsx";
import * as Style from "./Navbar.style";

interface INavbarProps {
  /**
   * This function will be called when the user presses the sidebar button. It should
   * toggle the current state of the sidebar.
   */
  onSidebarToggle?: () => void;
  /**
   * Anything that can go on the right side of the logo.
   */
  versionName?: string;
  /**
   * Ideal logo width. The height will be based around this width.
   */
  logoWidth?: number;
}

/**
 * This is the main navigation bar located at the top of the page.
 */
function Navbar(props: INavbarProps) {
  const { logoWidth, onSidebarToggle } = props;
  const navigate = useNavigate();
  const theme = useTheme();

  const signOut = useCallback(() => {
    store.account = undefined;
    store.token = "";
    setLocalStorage("token", "");
    navigate("/console/login");
  }, [navigate]);

  const renderNavbarButtons = (
    plugin: IPluginListItem,
    buttons: IPluginButtonModuleSetupOption[],
  ) => {
    return (
      <Fragment key={plugin.id}>
        {buttons.map((button) => {
          if (button.action.type !== "open-url") {
            // only urls supported for now
            return null;
          }

          let buttonURL = String(button.action.url).replace(/\/\//g, "/");
          if (!buttonURL.startsWith("/")) {
            buttonURL = `/${buttonURL}`;
          }
          if (!buttonURL.startsWith("/console/")) {
            buttonURL = `/console${buttonURL}`;
          }

          return (
            <Link key={button.icon} href={buttonURL}>
              <Button type={EButton.primary}>
                <Icon size="18px" icon={button.icon as EIcon} />
              </Button>
            </Link>
          );
        })}
      </Fragment>
    );
  };

  const Logo =
    readableColor(theme.navBar, "black", "white") === "black"
      ? LogoBlack
      : LogoWhite;

  return (
    <Style.Container logoWidth={logoWidth || 120} data-testid="navbar">
      <Button
        className="sidebar-button"
        onClick={onSidebarToggle}
        type={EButton.primary}
        testId="sidebar-button"
      >
        <Icon size="17px" icon={EIcon.bars} />
      </Button>

      <div className="logo-container">
        <Logo data-testid="logo" />
        {props.versionName ? (
          <>
            <div className="pipe" />
            <span className="alpha">{props.versionName}</span>
          </>
        ) : null}
      </div>

      <Style.RightSection>
        {store.plugins.map((x) => renderNavbarButtons(x, x.buttons.navbar))}

        <Button onClick={signOut} type={EButton.primary}>
          <Icon size="17px" icon={EIcon["sign-out-alt"]} />
        </Button>
      </Style.RightSection>
    </Style.Container>
  );
}

export default observer(Navbar);
