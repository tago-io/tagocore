import styled, { css, keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/**
 * Main style of the component.
 */
export const Container = styled.i<{
  isRotating?: boolean;
  size: string;
  color?: string;
}>`
  display: inline-block;
  width: ${(props) => props.size};
  height: ${(props) => props.size};

  svg {
    fill: ${(props) => props.color};
    display: block;
    width: ${(props) => props.size};
    height: ${(props) => props.size};

    *:not(.preserve) {
      fill: ${(props) => props.color};
      stroke: ${(props) => props.color};
    }
  }

  ${(props) =>
    props.isRotating &&
    css`
      svg {
        animation: ${rotate} infinite linear 0.75s;
      }
    `}
`;

export const IconFallback = styled.div<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

export default Container;
