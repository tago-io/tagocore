import { darken } from "polished";
import styled from "styled-components";
import * as ButtonStyle from "../Button/Button.style";

/**
 * Main style.
 */
export const Container = styled.nav<{ logoWidth: number }>`
  height: 45px;
  padding: 5px 10px;
  width: 100%;
  background: ${(props) => props.theme.navBar};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  display: flex;
  z-index: 4;
  flex: none;

  ${ButtonStyle.Container} {
    /* all buttons should have the same style in this navbar */
    height: 35px;
    border: 0;
    background-color: ${(props) => props.theme.navBarButton};

    svg * {
      fill: ${(props) => props.theme.navBarIcon};
    }

    &:hover {
      background-color: ${(props) => darken(0.05, props.theme.navBarButton)};
    }
    &:active {
      background-color: ${(props) => darken(0.1, props.theme.navBarButton)};
    }
  }

  > .sidebar-button {
    /* only affects the sidebar toggle button */
    width: 47px;
    padding: 6px 10px;
    margin-right: 5px;
    background-color: ${(props) => props.theme.navBarButton};

    svg * {
      fill: ${(props) => props.theme.navBarIcon};
    }
  }

  > .logo-container {
    /* makes the logo not stretch vertically */
    display: flex;
    align-items: center;

    svg {
      width: ${(props) => props.logoWidth}px;
      height: auto;
    }

    > .pipe {
      background: ${(props) => props.theme.navBarIcon};
      border: none;
      font-size: 2.5rem;
      height: 20px;
      margin: 0px 10px;
      width: 2px;
    }

    > .alpha {
      color: ${(props) => props.theme.navBarIcon};
      font-weight: bold;
    }
  }
`;

/**
 * This is the right side of the navbar.
 */
export const RightSection = styled.section`
  flex: 1;
  justify-content: flex-end;
  display: flex;
  align-items: center;

  > button:not(:last-child) {
    /* margin-right: 5px; */
  }
`;
