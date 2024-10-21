import styled, { keyframes } from "styled-components";

const animatedTo = keyframes`
  from { top: 0px; opacity: 1 }
  to { top: -5px; opacity: 0 }
`;

const animatedFrom = keyframes`
  from { top: 10px; opacity: 0 }
  to { top: 0px; opacity: 1 }
`;

/**
 * Main container.
 */
export const Container = styled.div<{ iconColor?: string; backgroundColor?: string }>`
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 10px 15px;
  background: ${(props) => props.backgroundColor};
  border: 1px solid rgba(0, 0, 0, 0.07);

  h2 {
    color: ${(props) => props.iconColor};
    font-size: 1rem;
  }

  > .stretch {
    flex: 1;
    display: flex;
    align-items: center;

    > i {
      margin-right: 10px;
    }
  }

  button {
    background: rgba(0, 0, 0, 0.05);
    width: 168px;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
    &:active {
      background: rgba(0, 0, 0, 0.15);
    }
  }

  .value {
    position: relative;

    &.animated-to {
      animation: ${animatedTo} 0.35s forwards;
    }
    &.animated-from {
      animation: ${animatedFrom} 0.35s forwards;
    }
  }
`;
