import styled from "styled-components";

/**
 * Main container style.
 */
export const Container = styled.div`
  position: relative;
`;

/**
 * Hint style.
 */
export const Hint = styled.div`
  border-radius: 4px;
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translate(0%, -50%);
  cursor: pointer;
  z-index: 5;
  padding: 5px 7px;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background: rgba(0, 0, 0, 0.15);
  }

  i {
    position: relative;
    top: 1px;
  }
`;
