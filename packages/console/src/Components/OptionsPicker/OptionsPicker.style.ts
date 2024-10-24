import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`;

/**
 */
export const Container = styled.div`
  position: relative;
`;

/**
 */
export const Options = styled.div<{ position: string }>`
  position: absolute;
  border: 1px solid ${(props) => props.theme.fieldsetBorder};
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
  background: ${(props) => props.theme.background1};
  border-radius: 3px;
  overflow: auto;
  width: 100%;
  max-height: 200px;
  animation: ${fadeIn} 0.2s;
  z-index: 5;

  .option {
    padding: 7px 10px;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
    &:not(:last-child) {
      border-bottom: 1px solid ${(props) => props.theme.fieldsetBorder};
    }
  }

  ${(props) =>
    props.position === "top"
      ? css`
          bottom: 100%;
        `
      : css`
          top: 100%;
        `}
`;

/**
 */
export const IconContainer = styled.div<{ $clickable?: boolean }>`
  position: absolute;
  right: 10px;
  z-index: 4;
  top: 50%;
  transform: translate(0%, -50%);
  padding: 5px;
  border-radius: 3px;
  display: flex;
  align-items: center;

  ${(props) =>
    props.$clickable &&
    css`
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.07);
      }
      &:active {
        background: rgba(0, 0, 0, 0.14);
      }
    `}
`;
