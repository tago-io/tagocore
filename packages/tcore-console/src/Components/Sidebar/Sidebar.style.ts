import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import * as PluginImageStyle from "../PluginImage/PluginImage.style";

/**
 * Style for the main sidebar container.
 */
export const Container = styled.aside<{ open?: boolean }>`
  background-color: ${(props) => props.theme.background3};
  max-width: 270px;
  box-shadow: 0 4px 4px 0 hsla(0, 0%, 0%, 0.2);
  width: 100%;
  left: 0px;
  position: absolute;
  top: 45px;
  height: calc(100% - 45px);
  z-index: 3;
  overflow: auto;
  box-sizing: border-box;
  transition: box-shadow 0.5s, transform 0.5s cubic-bezier(0.55, 0, 0.1, 1),
    opacity 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  padding: 5px;
  display: flex;
  flex-direction: column;

  ${(props) => css`
    transform: ${props.open ? "translateX(0)" : "translateX(-100%)"};
    opacity: ${props.open ? "1" : "0"};
  `}

  .stretch {
    flex: 1;
  }

  .row {
    display: flex;
    width: 100%;
  }
`;

/**
 * Style for a single item in the sidebar.
 */
export const Item = styled(Link)<{
  $isVertical?: boolean;
  color: string;
  selected?: boolean;
  disabled?: boolean;
}>`
  padding: 15px 7px;
  background-color: ${(props) => props.theme.background1};
  border-radius: 3px;
  box-shadow: rgb(0 0 0 / 10%) 0px 2px 4px 0px;
  margin: 1.5px;
  height: 51.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  position: relative;
  flex: 1;

  .description {
    font-size: 0.73rem;
    color: ${(props) => props.theme.font2};
    margin-top: 3px;
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    font-weight: bold;
    opacity: 0.75;
  }

  i {
    margin-right: 10px;
  }

  &:hover {
    *:not(.preserve) {
      color: ${(props) => props.color};
      fill: ${(props) => props.color};
    }
  }

  ${PluginImageStyle.Container} {
    margin-right: 10px;
  }

  &:active {
    border-bottom: 1px solid ${(props) => props.color};
  }

  ${(props) =>
    props.selected &&
    css`
      border-bottom: 1px solid ${props.color};
      *:not(.preserve) {
        color: ${props.color} !important;
        fill: ${props.color};
      }
    `}

  ${(props) =>
    props.$isVertical &&
    css`
      flex-direction: column;
      text-align: center;
      justify-content: center;
      align-items: center;
      padding: 10px 10px 7px;
      min-height: 51px;

      i {
        margin-right: 0;
      }
    `}

  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;

      i,
      span {
        opacity: 0.5;
      }
    `}
`;
