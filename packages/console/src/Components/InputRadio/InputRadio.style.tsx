import styled, { css } from "styled-components";

/**
 */
export const Container = styled.div<{ stretch?: boolean }>`
  display: flex;

  > .item:nth-child(1) {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  > .item:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  ${(props) =>
    props.stretch &&
    css`
      flex: 1;
      width: 100%;
    `}
`;

/**
 */
export const Item = styled.button<{ stretch?: boolean; selected?: boolean }>`
  padding: 5px 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.buttonDefault};
  color: ${(props) => props.theme.buttonDefaultFont};
  margin-right: -1px;
  cursor: pointer;
  outline: 0;
  justify-content: center;

  ${(props) =>
    props.selected &&
    css`
      background: ${props.theme.buttonPrimary};
      color: ${props.theme.buttonPrimaryFont};
    `}

  ${(props) =>
    props.stretch &&
    css`
      flex: 1;
    `}
`;
