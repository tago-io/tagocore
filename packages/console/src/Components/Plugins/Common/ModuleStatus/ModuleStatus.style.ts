import styled, { css } from "styled-components";
import * as ButtonStyle from "../../../Button/Button.style";

/**
 * Main container.
 */
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 5px;

  > .error {
    background: hsla(0, 100%, 44%, 0.1);
    padding: 5px 10px;
    display: flex;
    align-items: center;

    i {
      margin-right: 7px;
    }
  }
`;

/**
 */
export const Status = styled.div<{ running?: boolean }>`
  flex: 1;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.03);
  padding: 10px;
  width: 100%;
  transition: opacity 0.2s;

  ${(props) =>
    !props.running &&
    css`
      opacity: 0.7;
    `}

  > .title {
    display: flex;
    align-items: center;
    flex: 1;
  }

  > .buttons-container {
    flex: none;
    > .buttons-inner {
      flex: none;
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border-radius: 3px;

      ${ButtonStyle.Container}:first-child {
        margin-right: -1px;
      }

      ${ButtonStyle.Container}:not(:disabled) {
        z-index: 1;
      }

      ${ButtonStyle.Container} {
        border-radius: 0;
        border: 0 !important;
      }
    }
  }
`;
