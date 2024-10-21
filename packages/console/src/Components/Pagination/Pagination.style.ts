import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

/**
 * Main style.
 */
export const Container = styled.div`
  flex: none;
  background: ${(props) => props.theme.background2};
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0px 15px;
  display: flex;
  z-index: 1;
  position: relative;

  .config-button,
  .refresh-button {
    position: absolute;
    top: 50%;
    padding: 7px 10px;
    cursor: pointer;
    border-radius: 5px;
    transform: translate(0%, -50%);
    display: flex;
    align-items: center;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .config-button {
    left: 10px;
  }

  .refresh-button {
    right: 10px;
  }
`;

/**
 * A single page button.
 */
export const Button = styled.button<{ selected?: boolean }>`
  border: 0;
  height: 27px;
  min-width: 30px;
  padding: 0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.15s;
  animation: ${fadeIn} 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    > * {
      opacity: 0.4;
    }
    background: transparent !important;
    cursor: initial;
  }

  ${(props) =>
    props.selected &&
    css`
      background: rgba(0, 0, 0, 0.25);
    `}
`;

export const PaginationSeparator = styled.div`
  border: 1px solid transparent;
  padding: 0;
  border-radius: 5px;
  min-width: 30px;
  width: initial;
  display: flex;
  align-items: center;
  justify-content: center;
`;
