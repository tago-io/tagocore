import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import * as PluginImageStyle from "../../PluginImage/PluginImage.style";

/**
 * Style for a single item in the sidebar.
 */
export const Container = styled(Link)<{
  color: string;
  selected?: boolean;
  $dropdownVisible?: boolean;
  disabled?: boolean;
}>`
  padding: 10px 10px;
  border-radius: 3px;
  background: white;
  border: 1px solid transparent;
  box-shadow: rgb(0 0 0 / 10%) 0px 2px 4px 0px;
  margin: 1.5px;
  margin-bottom: 3px;
  height: 55px;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;

  &:hover {
    * {
      color: ${(props) => props.color} !important;
      fill: ${(props) => props.color};
    }
  }

  ${(props) =>
    !props.$dropdownVisible &&
    css`
      &:active {
        border-bottom: 1px solid ${props.color};
      }
    `}

  ${PluginImageStyle.Container} {
    margin-right: 10px;
  }

  ${(props) =>
    props.selected &&
    css`
      border-bottom: 1px solid ${props.color} !important;
      * {
        color: ${props.color} !important;
        fill: ${props.color};
      }
    `}

  ${(props) =>
    props.disabled &&
    css`
      .img-container {
        opacity: 0.5;
      }
    `}
`;

/**
 */
export const TitleContainer = styled.div<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  flex: 1;

  > .title {
    display: flex;
    flex: 1;
    flex-direction: column;

    .title-row {
      display: flex;
    }

    .version {
      color: rgba(0, 0, 0, 0.5);
      font-size: 0.73rem;
      margin-top: 2px;
    }

    .disabled {
      font-style: italic;
      color: rgba(0, 0, 0, 0.5);
      font-size: 0.73rem;
      margin-top: 2px;
    }
  }

  .error {
    position: relative;
    margin-left: 5px;
  }

  ${(props) =>
    props.disabled &&
    css`
      .title {
        opacity: 0.65;
      }
    `}
`;

/**
 */
export const Options = styled.div`
  padding: 5px;
  border-radius: 5px;
  margin-left: 10px;
  display: flex;
  align-items: center;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: rgba(0, 0, 0, 0.15);
  }

  i * {
    fill: rgba(0, 0, 0, 0.5) !important;
  }
`;

/**
 */
export const Dropdown = styled.div<{ visible: boolean }>`
  position: absolute;
  right: 0px;
  top: 40px;
  padding: 5px 0px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background: white;
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s;

  > .item {
    padding: 7px 15px;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      margin-left: 5px;
    }

    * {
      color: black !important;
      fill: black !important;
    }

    &:hover {
      * {
        color: white !important;
        fill: white !important;
      }
      background: black;
    }
  }

  ${(props) =>
    props.visible &&
    css`
      pointer-events: initial;
      opacity: 1;
    `}
`;
