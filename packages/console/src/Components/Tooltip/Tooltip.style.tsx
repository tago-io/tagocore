import styled, { css } from "styled-components";

/**
 * Main container.
 */
export const Container = styled.div<{
  zIndex?: number;
  hoverable?: boolean;
  $vertical?: boolean;
  error?: boolean;
  color?: string;
}>`
  position: fixed;
  z-index: ${(props) => props.zIndex || 99999};
  background-color: ${(props) => props.theme.background1};
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  max-width: 350px;
  display: flex;
  transition:
    opacity 0.2s,
    margin 0.3s;
  transition-timing-function: cubic-bezier(0.17, 0.67, 0.2, 1.37);
  opacity: 0;
  margin-top: 10px;
  pointer-events: none;
  flex-direction: ${(props) => (props.$vertical ? "column" : "row")};

  &.invisible {
    opacity: 0;
    margin-top: 10px;
    pointer-events: none;
  }
  &.visible,
  &:hover {
    opacity: 1;
    margin-top: 0px;
    display: flex;
    pointer-events: ${(props) => (props.hoverable ? "inherit" : "none")};
  }

  .header {
    padding: 8px;
    background-color: ${(props) => props.color || "rgba(0, 0, 0, 0.05)"};
    display: flex;
    align-items: center;
    flex: none;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;

    i {
      margin: 0px 4px;
    }

    span {
      margin-left: 3px;
    }

    * {
      font-size: 1rem;
      font-weight: 500;
    }

    ${(props) =>
      props.color &&
      css`
        * {
          fill: white;
        }
      `}
  }

  .content {
    position: relative;
    padding: ${(props) => (props.$vertical ? "8px 10px" : "8px")};
  }

  .hoverable-step {
    width: 100%;
    position: absolute;
    left: 0px;
    bottom: -10px;
    height: 20px;
  }
`;
Container.displayName = "TooltipContainer";
