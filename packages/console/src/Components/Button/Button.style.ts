import { darken } from "polished";
import styled, { css, type DefaultTheme } from "styled-components";
import * as IconStyle from "../Icon/Icon.style";
import { EButton } from "./Button.types";

/**
 * Props for the container.
 */
export interface IButtonContainerProps {
  $buttonType?: EButton;
  theme: DefaultTheme;
  color?: string;
  addIconMargin?: boolean;
}

/**
 * Main style for the button component.
 */
export const Container = styled.button<IButtonContainerProps>`
  display: inline-flex;
  padding: 8px 20px;
  border-radius: 3px;
  cursor: pointer;
  outline: 0;
  border: 1px solid transparent;
  justify-content: center;
  align-items: center;

  :disabled {
    pointer-events: none;
    opacity: 0.7;
    color: ${(props) => props.theme.buttonDisabledFont} !important;
    border-color: transparent;
    background-color: ${(props) => props.theme.buttonDisabled};

    * {
      fill: ${(props) => props.theme.buttonDisabledFont} !important;
      color: ${(props) => props.theme.buttonDisabledFont} !important;
    }
  }

  ${(props) => applyTypeCss(props)}

  ${(props) =>
    props.addIconMargin &&
    css`
      ${IconStyle.Container} {
        /* used to add a bit of margin between an icon and the text */
        margin-right: 5px;
      }
    `}
`;

/**
 * Returns the css for the button colors.
 */
function applyTypeCss(props: IButtonContainerProps) {
  let color = props.theme.buttonDefaultFont;

  let background = props.theme.buttonDefault;
  let hoverBackground = null;
  let activeBackground = null;
  let hoverColor = null;

  // let borderColor = "rgba(0, 0, 0, 0.12)";
  let padding = "8px 20px";
  let width = "auto";

  if (props.$buttonType === EButton.primary) {
    color = props.theme.buttonPrimaryFont;
    background = props.theme.buttonPrimary;
    // borderColor = "transparent";
  } else if (props.$buttonType === EButton.danger) {
    color = props.theme.buttonDangerFont;
    background = props.theme.buttonDanger;
    // borderColor = "transparent";
  } else if (props.$buttonType === EButton.danger_outline) {
    color = props.theme.buttonDanger;
    background = "transparent";
    // borderColor = props.theme.buttonDanger;
    hoverBackground = darken(0.04, props.theme.buttonDanger);
    activeBackground = darken(0.08, props.theme.buttonDanger);
    hoverColor = "white";
  } else if (props.$buttonType === EButton.warning) {
    color = props.theme.buttonWarningText;
    background = props.theme.buttonWarning;
    // borderColor = "transparent";
  } else if (props.$buttonType === EButton.icon) {
    padding = "8px 15px";
    width = "45px";
  }

  if (props.color) {
    color = "white";
    background = props.color;
    // borderColor = background;
  }

  if (!hoverBackground) {
    // if the hover background-color wasn't informed, use the default one but darker
    hoverBackground = darken(0.04, background);
  }
  if (!activeBackground) {
    // if the active background-color wasn't informed, use the default one but darker
    activeBackground = darken(0.08, background);
  }
  if (!hoverColor) {
    // if the hover color wasn't specified, use the default color
    // hoverColor = color;
  }

  return css`
    color: ${color};
    background: ${background};
    border-color: transparent;
    padding: ${padding};
    width: ${width};

    * {
      fill: ${color};
      color: ${color};
    }

    :hover {
      background-color: ${hoverBackground};
      color: ${hoverColor};

      * {
        fill: ${hoverColor};
        color: ${hoverColor};
      }
    }

    :active {
      background-color: ${activeBackground};
    }
  `;
}
