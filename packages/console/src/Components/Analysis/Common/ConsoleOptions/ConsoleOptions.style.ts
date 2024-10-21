import styled, { css } from "styled-components";

export const Container = styled.div<{ visible: boolean }>`
  position: absolute;
  right: 10px;
  top: 45px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 5px 0px;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  opacity: 0;
  margin-top: -10px;
  transition: opacity 0.2s, margin 0.3s;
  transition-timing-function: cubic-bezier(0.17, 0.67, 0.2, 1.37);

  .item {
    padding: 7px 13px;
    display: flex;
    cursor: pointer;
    align-items: center;

    span {
      margin-left: 5px;
    }

    &:hover {
      background: ${(props) => props.theme.buttonPrimary};

      * {
        color: ${(props) => props.theme.buttonPrimaryFont};
        fill: ${(props) => props.theme.buttonPrimaryFont};
      }
    }
  }

  ${(props) =>
    props.visible &&
    css`
      opacity: 1;
      margin-top: 0px;
      pointer-events: inherit;
    `}

  ${(props) =>
    !props.visible &&
    css`
      pointer-events: none;
    `}
`;
