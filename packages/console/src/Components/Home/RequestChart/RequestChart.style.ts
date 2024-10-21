import styled from "styled-components";

/**
 * Main style.
 */
export const Container = styled.div<{ visible: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  opacity: ${(props) => (props.visible ? "1" : "0")};

  .tooltip-container {
    display: flex;
    flex-direction: column;
  }

  .tooltip-content {
    padding: 8px;
  }

  .tooltip-warning {
    padding: 8px;
    background-color: rgba(0, 0, 0, 0.05);

    svg {
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }
  }
`;
