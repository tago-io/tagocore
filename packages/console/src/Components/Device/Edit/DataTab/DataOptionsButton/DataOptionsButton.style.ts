import styled, { css } from "styled-components";

export const Options = styled.button`
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
